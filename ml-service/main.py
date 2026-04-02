from fastapi import FastAPI
from pydantic import BaseModel
from bkt_model import BKTModel

app = FastAPI(title="BKT ML Service")
model = BKTModel()

class UpdateRequest(BaseModel):
    p_l: float        # current mastery score
    correct: bool     # did student answer correctly?

class SequenceRequest(BaseModel):
    responses: list[bool]   # e.g. [True, False, True, True]

@app.get("/")
def root():
    return {"status": "BKT service running"}

@app.post("/update")
def update_mastery(req: UpdateRequest):
    new_p_l = model.update(req.p_l, req.correct)
    return {
        "p_l": new_p_l,
        "mastered": model.is_mastered(new_p_l)
    }

@app.post("/sequence")
def run_sequence(req: SequenceRequest):
    history = model.run_sequence(req.responses)
    return {
        "history": history,
        "final_p_l": history[-1],
        "mastered": model.is_mastered(history[-1])
    }