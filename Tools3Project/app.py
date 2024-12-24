import app
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId
import os
app = Flask(__name__)
CORS(app)

MONGO_HOST = os.getenv("MONGO_HOST", "localhost")
MONGO_PORT = os.getenv("MONGO_PORT", "27017")
MONGO_URI = f"mongodb://{MONGO_HOST}:{MONGO_PORT}"

client = MongoClient(MONGO_URI)

db = client["ToolsThree"]
users_collection = db["users"]
orders_collection = db["orders"]
couriers_collection = db["couriers"]

print(f"Using clinet: {client.name}")
print(f"Connected to database: {db.name}")
print(f"Using collection: {users_collection.name}")

@app.route('/register', methods=['POST'])
def register_user():
    try:
        _json = request.json
        _userName = _json['userName']
        _email = _json['email']
        _password = _json['password']
        _phoneNumber = _json['phoneNumber']
        _status = "offline"

        if _userName and _email and _password and _phoneNumber and request.method == 'POST':
            if users_collection.find_one({"$or": [{"userName": _userName}, {"email": _email}]}):
                return jsonify({'message': 'Username or email already exists'}), 400
            if not _phoneNumber.isdigit():
                return jsonify({'message': 'Phone number must be numeric'}), 400
            else:
                hashed_password = generate_password_hash(_password)
                new_user = {"userName": _userName, "email": _email, "password": hashed_password, "phoneNumber": _phoneNumber, "status": _status}
                users_collection.insert_one(new_user)

                return jsonify({'message': 'User registered successfully!'}), 201
        else:
            return jsonify({'message': 'Invalid data'}), 400
    except Exception as e:
        print(str(e) + " this is error ")
        return jsonify({'message': 'Error registering user'}), 500

@app.route('/registerCourier', methods=['POST'])
def register_courier():
    try:
        _json = request.json
        _userName = _json['userName']
        _email = _json['email']
        _password = _json['password']
        _phoneNumber = _json['phoneNumber']

        if _userName and _email and _password and _phoneNumber and request.method == 'POST':
            if couriers_collection.find_one({"$or": [{"userName": _userName}, {"email": _email}]}):
                return jsonify({'message': 'Username or email already exists'}), 400
            if not _phoneNumber.isdigit():
                return jsonify({'message': 'Phone number must be numeric'}), 400
            else:
                hashed_password = generate_password_hash(_password)
                new_courier = {"userName": _userName, "email": _email, "password": hashed_password, "phoneNumber": _phoneNumber}
                couriers_collection.insert_one(new_courier)

                return jsonify({'message': 'User registered successfully!'}), 201
        else:
            return jsonify({'message': 'Invalid data'}), 400
    except Exception as e:
        print(str(e) + " this is error ")
        return jsonify({'message': 'Error registering user'}), 500

@app.route('/login', methods=['GET'])
def login_user():
    try:
        _userName = request.args.get('userName')
        _password = request.args.get('password')
        if _userName and _password:
            user = users_collection.find_one({"userName": _userName})
            if user and check_password_hash(user['password'], _password):
                users_collection.update_one(
                    {"userName": user["userName"]},
                    {"$set": {"status": "online"}}
                )

                user_details = {
                    'userName': user['userName'],
                    'email': user.get('email') ,
                    'phoneNumber': user.get('phoneNumber')
                }
                return jsonify({'message': 'Login successful!', 'user': user_details}), 200
            else:
                return jsonify({'message': 'Invalid credentials'}), 401
        else:
            return jsonify({'message': 'Invalid data'}), 400
    except Exception as e:
        print(e)
        return jsonify({'message': 'Error logging in'}), 500

@app.route('/loginCourier', methods=['GET'])
def login_courier():
    try:
        _userName = request.args.get('userName')
        _password = request.args.get('password')
        if _userName and _password:
            courier = couriers_collection.find_one({"userName": _userName})
            if courier and check_password_hash(courier['password'], _password):
                courier_details = {
                    'userName': courier['userName'],
                    'email': courier.get('email') ,
                    'phoneNumber': courier.get('phoneNumber')
                }
                return jsonify({'message': 'Login successful!', 'user': courier_details}), 200
            else:
                return jsonify({'message': 'Invalid credentials'}), 401
        else:
            return jsonify({'message': 'Invalid data'}), 400
    except Exception as e:
        print(e)
        return jsonify({'message': 'Error logging in'}), 500

@app.route('/createOrder', methods=['POST'])
def create_order():
    try:
        order_data = request.json
        pickup_location = order_data['pickupLocation']
        dropoff_location = order_data['dropoffLocation']
        package_details = order_data['packageDetails']
        delivery_time = order_data['deliveryTime']
        userName = order_data['userName']
        courier = order_data['courier']
        status = "PENDING"

        if pickup_location and dropoff_location and package_details and delivery_time and courier:
            new_order = {
                "pickupLocation": pickup_location,
                "dropoffLocation": dropoff_location,
                "packageDetails": package_details,
                "deliveryTime": delivery_time,
                "userName": userName,
                "courier": courier,
                "status": status
            }
            result = orders_collection.insert_one(new_order)
            return jsonify({
                'message': 'Order created successfully',
                'order_id': str(result.inserted_id)
            }), 201
        else:
            return jsonify({'message': 'Missing required fields'}), 400

    except Exception as e:
        print(e)
        return jsonify({'message': 'Error creating order'}), 500

@app.route('/couriers', methods=['GET'])
def get_couriers():
    try:
        couriers = couriers_collection.find({}, {"_id": 0, "userName": 1})
        courier_list = [courier['userName'] for courier in couriers]
        return jsonify({'couriers': courier_list}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': 'Error fetching couriers'}), 500

@app.route('/logout', methods=['POST'])
def logout_user():
    try:
        userName = request.json.get('userName')
        if userName:
            user = users_collection.find_one({"userName": userName})
            if user:
                users_collection.update_one(
                    {"userName": userName},
                    {"$set": {"status": "offline"}}
                )
                return jsonify({'message': 'Logout successful!'}), 200
            else:
                return jsonify({'message': 'User not found'}), 404
        else:
            return jsonify({'message': 'username required'}), 400
    except Exception as e:
        print(e)
        return jsonify({'message': 'Error logging out'}), 500


@app.route('/getCourierOrders', methods=['GET'])
def get_courier_orders():
    try:
        courier = request.args.get('courier')
        if courier:
            orders = list(orders_collection.find({"courier": courier}))
            for order in orders:
                order['_id'] = str(order['_id'])

            return jsonify({'orders': orders}), 200
        else:
            return jsonify({'message': 'Courier name is required'}), 400

    except Exception as e:
        print(e)
        return jsonify({'message': 'Error fetching orders'}), 500

@app.route('/admin/getAllOrders', methods=['GET'])
def get_all_orders():
    try:
        orders = orders_collection.find()
        orders_list = [{**order, '_id': str(order['_id'])} for order in orders]
        return jsonify({'orders': orders_list}), 200
    except Exception as e:
        print(f"Error fetching all orders: {e}")
        return jsonify({'message': 'Error fetching orders'}), 500

@app.route('/getIds', methods=['GET'])
def getIds():
    try:
        courier = request.args.get('courier')

        if courier:
            orderIds = orders_collection.find({"courier": courier})
            orderId_list = [str(order['_id']) for order in orderIds]

            return jsonify({'orderIds': orderId_list}), 200

        else:
            return jsonify({'message': 'Courier name is required'}), 400

    except Exception as e:
        print(e)
        return jsonify({'message': 'Error fetching orders'}), 500

@app.route('/getIdsForUser', methods=['GET'])
def getIdsForUser():
    try:
        userName = request.args.get('userName')

        if userName:
            orderIds = orders_collection.find({"userName": userName})
            orderId_list = [str(order['_id']) for order in orderIds]

            return jsonify({'orderIds': orderId_list}), 200

        else:
            return jsonify({'message': 'User name is required'}), 400

    except Exception as e:
        print(e)
        return jsonify({'message': 'Error fetching orders'}), 500

@app.route('/updateOrderStatus', methods=['PATCH'])
def update_order_status():
    try:
        data = request.json
        _id = data.get('_id')
        status = data.get('status')

        if not _id or not status:
            return jsonify({'message': 'Order ID and status are required'}), 400

        result = orders_collection.update_one(
            {"_id": ObjectId(_id)},
            {"$set": {"status": status}}
        )

        if result.matched_count > 0:
            return jsonify({'message': 'Order status updated successfully'}), 200
        else:
            return jsonify({'message': 'Order not found'}), 404

    except Exception as e:
        print(f"Error updating order status: {e}")
        return jsonify({'message': 'Error updating order status'}), 500

@app.route('/getUserOrders', methods=['GET'])
def get_user_orders():
    try:
        userName = request.args.get('userName')
        if not userName:
            return jsonify({'message': 'User name is required'}), 400

        orders = orders_collection.find({'userName': userName})
        order_list = [{**order, '_id': str(order['_id'])} for order in orders]
        return jsonify({'orders': order_list}), 200
    except Exception as e:
        print(f"Error fetching user orders: {e}")
        return jsonify({'message': 'Error fetching user orders'}), 500

@app.route('/cancelOrder', methods=['PATCH'])
def cancel_order():
    try:
        data = request.json
        order_id = data.get('_id')

        if not order_id:
            return jsonify({'message': 'Order ID is required'}), 400

        result = orders_collection.update_one(
            {"_id": ObjectId(order_id), "status": "PENDING"},
            {"$set": {"status": "CANCELED"}}
        )

        if result.matched_count > 0:
            return jsonify({'message': 'Order canceled successfully'}), 200
        else:
            return jsonify({'message': 'Order not found or already processed'}), 404
    except Exception as e:
        print(f"Error canceling order: {e}")
        return jsonify({'message': 'Error canceling order'}), 500


@app.route('/admin/deleteOrder/<_id>', methods=['DELETE'])
def delete_order(_id):
    try:
        result = orders_collection.delete_one({"_id": ObjectId(_id)})
        if not _id :
            return jsonify({'message': 'Order ID and status are required'}), 400

        if result.deleted_count > 0:
            return jsonify({'message': 'Order deleted successfully'}), 200
        else:
            return jsonify({'message': 'Order not found'}), 404
    except Exception as e:
        print(f"Error deleting order: {e}")
        return jsonify({'message': 'Error deleting order'}), 500

@app.route('/admin/reassignOrder', methods=['PUT'])
def reassign_order():
    try:
        data = request.json
        _id = data.get('_id')
        courier = data.get('courier')

        if not _id or not courier:
            return jsonify({'message': 'Order ID and courier name are required'}), 400

        result = orders_collection.update_one(
            {'_id': ObjectId(_id)},
            {'$set': {'courier': courier}}
        )

        if result.modified_count > 0:
            return jsonify({'message': 'Order reassigned successfully'}), 200
        else:
            return jsonify({'message': 'Order not found or no update made'}), 404
    except Exception as e:
        print(f"Error reassigning order: {e}")
        return jsonify({'message': 'Error reassigning order'}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)