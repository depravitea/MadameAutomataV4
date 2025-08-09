
import random, string

def cuid() -> str:
    # simple unique id for demo purposes
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=24))
