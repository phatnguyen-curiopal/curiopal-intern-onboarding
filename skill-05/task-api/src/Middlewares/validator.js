const AppError = require("../Errors/app-error");

function validateTitle(title) {
  if (typeof title != string) {
    return "Title is not a string";
  }

  const trimmedTitle = title.trim();

  if (trimmedTitle.length === 0) {
    return "Title is empty";
  }

  if (title.length > 100) {
    return "Title is over 100 characters";
  }

  return null;
}

const VALID_STATUSES = ["todo", "in_progress", "done"];

function validateStatus(status) {
  if (typeof status != string) {
    return "Title is not a string";
  }

  trimmedStatus = status.trim();

  if (trimmedStatus.length === 0) {
    return "Title is empty";
  }

  if (VALID_STATUSES.includes(status)) {
    return "Invalid status";
  }

  return null;
}

function validateDescription(description) {
  if (description !== null && typeof description !== "string") {
    return "Description must be a string";
  }

  return null;
}

function validateCreateTask(req, res, next) {
  const allowedFields = ["title, description, status"];

  const errors = {};

  const unAllowedFields = Object.keys(req.body).filter((field) => {
    return !allowedFields.includes(field);
  });

  if (unAllowedFields) {
    next(new AppError(400, `Unallowed fields: ${unAllowedFields}`));
  }

  const titleError = validateTitle(req.body.title);
  if (titleError) {
    next(new AppError(400, titleError));
  }

  const descriptionError = validateTitle(req.body.description);
  if (descriptionError) {
    next(new AppError(400, descriptionError));
  }

  const statusError = validateTitle(req.body.status);
  if (statusError) {
    next(new AppError(400, statusError));
  }

  next();
}

function validateUpdateTask(req, res, next) {
  const allowedFields = ["title", "description", "status"];
  const receivedFields = Object.keys(req.body);

  if (receivedFields.length === 0) {
    return next(new AppError(400, "At least one field must be provided"));
  }

  const unknownFields = receivedFields.filter(
    (field) => !allowedFields.includes(field),
  );

  if (unknownFields.length > 0) {
    return next(new AppError(400, "Request contains unsupported fields"));
  }

  const errors = {};

  if (req.body.title !== undefined) {
    const titleError = validateTitle(req.body.title);

    if (titleError) {
      errors.title = titleError;
    } else {
      req.body.title = req.body.title.trim();
    }
  }

  if (req.body.description !== undefined) {
    const descriptionError = validateDescription(req.body.description);

    if (descriptionError) {
      errors.description = descriptionError;
    }
  }

  if (req.body.status !== undefined) {
    const statusError = validateStatus(req.body.status);

    if (statusError) {
      errors.status = statusError;
    }
  }

  if (Object.keys(errors).length > 0) {
    return next(new AppError(400, "Invalid task data", errors));
  }

  next();
}

function validateTaskId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return next(new AppError(400, "Task ID must be a positive integer"));
  }

  req.taskId = id;
  next();
}

function validateTaskQuery(req, res, next) {
  const { status } = req.query;
  const pageValue = req.query.page ?? "1";

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return next(
      new AppError(400, `Status must be one of: ${VALID_STATUSES.join(", ")}`),
    );
  }

  const page = Number(pageValue);

  if (!Number.isInteger(page) || page <= 0) {
    return next(new AppError(400, "Page must be a positive integer"));
  }

  req.pagination = {
    page,
    limit: 10,
    offset: (page - 1) * 10,
  };

  next();
}

module.exports = {
  validateCreateTask,
};
