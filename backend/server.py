from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
users=["Angshu","Baisakhi"]
app = Flask(__name__)
CORS(app)
@app.route("/")
def home():
    return "Python backend is running!"

@app.route("/message", methods=["GET", "POST", "PUT"])
def receive():

    data = request.get_data(as_text=True)
    print(data)
    #process(data)
    return process(data)

    return jsonify({
        "status": "success",
        "message": "Data received successfully",
        "reply": "Hello!"
    })


@app.route("/login", methods=["GET", "POST", "PUT"])
def login():
    data = request.get_json()
    database(data)
    return jsonify({
    "success": True,
    "message": "Login successful"
})

def load_user(username):
    filename=f"database/{username}.json"
    if not os.path.exists(filename):
        return None
    with open(filename,"r") as file:
        return json.load(file)

@app.route("/api/dashboard/<usr>")
def dashboard(usr):
    data=load_user(usr)
    print("Dashboard requested for:", usr)
    if data is None:
        return jsonify({
        "success":False,
        "message":"user not found"
        }),404
    return jsonify({
        "success":True,
        **data
    })


def process(data):
    pass
            
def database(data):
    username=data["username"]
    print(username)
    print(users)
    if(username in users):
        print("Exsisting Users")
    else:
        print("User Not Found")

app.run(host="0.0.0.0", port=50)