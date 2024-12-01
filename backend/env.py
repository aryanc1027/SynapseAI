import os
from dotenv import load_dotenv

load_dotenv(f"{os.path.dirname(__file__)}/.env", verbose=True)

def getenv(variable: str) -> str:
    value = os.getenv(variable)
    if value is not None:
        return value
    else:
        raise NameError(f"Error: {variable} Environment Variable not Defined")