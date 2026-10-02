from pydantic import BaseModel


class ValidationIssue(BaseModel):
    field: list[str | int]
    message: str


class APIError(BaseModel):
    code: str
    message: str
    details: list[ValidationIssue] | None = None


class ErrorResponse(BaseModel):
    error: APIError