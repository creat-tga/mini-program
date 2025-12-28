from fastapi import FastAPI
import uvicorn
import random
from uvicorn.config import LOGGING_CONFIG  # 导入默认配置

# 修改默认日志格式（启动、错误等信息）
LOGGING_CONFIG["formatters"]["default"]["fmt"] = "%(asctime)s %(levelprefix)s %(message)s"
LOGGING_CONFIG["formatters"]["default"]["datefmt"] = "%Y-%m-%d %H:%M:%S"  # 可选：自定义时间格式
# 关键：修改 access 日志（HTTP 请求记录）
LOGGING_CONFIG["formatters"]["access"]["fmt"] = (
    "%(asctime)s %(levelprefix)s %(client_addr)s - \"%(request_line)s\" %(status_code)s"
)
LOGGING_CONFIG["formatters"]["access"]["datefmt"] = "%Y-%m-%d %H:%M:%S"


app = FastAPI()
program = []
for i in range(20):
    program.append({
        "id": i,
        "name": "华发商都项目",
        "location": "广东省珠海市",
        "type": "商业综合体",
        "score": random.randint(10, 100),
        "coolingCapacity": random.randint(100, 10000) / 10,
        "COP": random.randint(200, 5000) / 100,
        "investReturn": random.randint(600, 1000) / 10
    })
program[1]["name"] = "广州办公楼项目123456789123456789"
program[1]["location"] = "广东省广州市"
program[2]["name"] = "珠海办公楼项目"
program[2]["location"] = "广东省珠海市"
program[3]["name"] = "上海办公楼项目"
program[3]["location"] = "上海市"


@app.get("/api/program/list")
async def programs_list():
    program.sort(key=lambda x:x["investReturn"])
    return {
        "code": 200,
        "data": program
    }

@app.post("/api/program/delete")
async def programs_delete(requestDate: dict):
    index = None
    for i in range(len(program)):
        if program[i]["id"] == int(requestDate["id"]):
            index = i
            break
    if index is not None and type(index) == int:
        del program[index]
    return {"code": 200, "data": program}

if __name__ == "__main__":
    uvicorn.run(app, host=["0.0.0.0", "::"], port=8000)