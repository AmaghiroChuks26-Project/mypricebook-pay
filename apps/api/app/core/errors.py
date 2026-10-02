import logging

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.schemas.errors import APIError, ErrorResponse, ValidationIssue

logger = logging.getLogger(__name__)


async def http_exception_handler(
    request: Request,
    exception: StarletteHTTPException,
) -> JSONResponse:
    message = exception.detail if isinstance(exception.detail, str) else "Request failed"
    body = ErrorResponse(error=APIError(code="http_error", message=message))
    return JSONResponse(
        status_code=exception.status_code,
        content=body.model_dump(mode="json", exclude_none=True),
        headers=exception.headers,
    )


async def validation_exception_handler(
    request: Request,
    exception: RequestValidationError,
) -> JSONResponse:
    issues = [
        ValidationIssue(
            field=[part for part in error.get("loc", ()) if isinstance(part, (str, int))],
            message=str(error.get("msg", "Invalid value")),
        )
        for error in exception.errors()
    ]
    body = ErrorResponse(
        error=APIError(
            code="validation_error",
            message="Request validation failed",
            details=issues,
        )
    )
    return JSONResponse(
        status_code=422,
        content=body.model_dump(mode="json", exclude_none=True),
    )


async def unexpected_exception_handler(request: Request, exception: Exception) -> JSONResponse:
    logger.exception("Unhandled API exception")
    body = ErrorResponse(
        error=APIError(
            code="internal_server_error",
            message="An unexpected error occurred",
        )
    )
    return JSONResponse(
        status_code=500,
        content=body.model_dump(mode="json", exclude_none=True),
    )