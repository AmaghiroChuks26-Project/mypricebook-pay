from fastapi import APIRouter

from app.api.v1.endpoints import health, products
from app.schemas.errors import ErrorResponse

api_router = APIRouter(
	responses={
		404: {"model": ErrorResponse, "description": "Resource not found"},
		422: {"model": ErrorResponse, "description": "Request validation failed"},
		500: {"model": ErrorResponse, "description": "Unexpected server error"},
	}
)
api_router.include_router(health.router)
api_router.include_router(products.router)