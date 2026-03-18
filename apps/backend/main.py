from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/api/message")
def get_message():
    return {
        "message": "Hello from the Kargo demo API!",
        "version": "1.0.0",
        "status": "ok",
    }


@app.get("/health")
def health():
    return {"status": "ok"}
