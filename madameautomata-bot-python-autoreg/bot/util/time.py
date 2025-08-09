
import re, random

def parse_duration(s: str) -> int:
    m = re.fullmatch(r'(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?', s.strip(), re.I)
    if not m: raise ValueError("Bad duration. Try 1d12h30m")
    d,h,mi,sec = (int(x) if x else 0 for x in m.groups())
    ms = (((d*24 + h)*60 + mi)*60 + sec)*1000
    if ms <= 0: raise ValueError("Duration must be > 0")
    return ms

def random_case(s: str, seed: int) -> str:
    rnd = random.Random(seed)
    out = []
    for ch in s:
        if ch.isalpha():
            out.append(ch.upper() if rnd.random()<0.5 else ch.lower())
        else:
            out.append(ch)
    return ''.join(out)
