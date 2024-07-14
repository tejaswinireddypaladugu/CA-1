import datetime
from flask import Flask, request, jsonify, abort, g, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from flask_cors import CORS
from functools import wraps
from flask_jwt_extended import JWTManager, get_jwt_identity
from sqlalchemy.dialects.postgresql import ARRAY
from datetime import datetime
import logging

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:kalki@localhost/Sunshine_Bakery'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['JWT_SECRET_KEY'] = 'replace_this_with_your_secret_key'  # Change this to a secure random key
CORS(app)  # Enable CORS for all routes
db = SQLAlchemy(app)
jwt = JWTManager(app)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Models
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    email  = db.Column(db.String(30), nullable = False)

    def __init__(self, username, password, email, role):
        self.username = username
        self.password = password
        self.role = role
        self.email = email

class MenuItem(db.Model):
    __tablename__ = 'menu_items'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    availability = db.Column(db.Boolean, default=True)  # Adjust data type as per your database schema

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': float(self.price),
            'availability': self.availability
        }
        
class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    quantity = db.Column(db.Integer)
    order_items = db.Column(db.Text)  # Store as JSON string

    def __repr__(self):
        return f"<Order {self.id}>"

class ContactMessage(db.Model):
    __tablename__ = 'contact_messages'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'message': self.message,
            'created_at': self.created_at
        }   
    
class Feedback(db.Model):
    __tablename__ = 'feedback'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at
        }
    
class Prebooking(db.Model):
    __tablename__ = 'prebookings'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    item_name = db.Column(db.String(20), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    special_requests = db.Column(db.Text, nullable=True)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    
@app.route('/api/contact_messages', methods=['POST'])
def create_contact_message():
    data = request.json
    new_message = ContactMessage(
        name=data['name'],
        email=data['email'],
        message=data['message']
    )
    db.session.add(new_message)
    db.session.commit()
    return jsonify(new_message.to_dict()), 201

@app.route('/api/contact_messages', methods=['GET'])
def get_contact_messages():
    messages = ContactMessage.query.all()
    return jsonify([message.to_dict() for message in messages])

@app.route('/api/admin/contact_messages', methods=['GET'])
def get_contact_message():
    messages = ContactMessage.query.all()
    return jsonify([message.to_dict() for message in messages])

@app.route('/api/admin/contact_messages/<int:id>', methods=['DELETE'])
def delete_contact_message(id):
    message = ContactMessage.query.get_or_404(id)
    db.session.delete(message)
    db.session.commit()
    return jsonify({'message': 'Message deleted successfully'})

@app.route('/api/admin/feedback/<int:id>', methods=['DELETE'])
def delete_feedback(id):
    message = Feedback.query.get_or_404(id)
    db.session.delete(message)
    db.session.commit()
    return jsonify({'message': 'Message deleted successfully'})
        
# Utility function to check admin role
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user = get_jwt_identity()
        if not current_user or current_user['role'] != 'admin':
            return jsonify({'message': 'Access forbidden: Admins only'}), 403
        return f(*args, **kwargs)
    return decorated_function

# Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')
    email = data.get('email')

    if not all([username, password, email, role]):
        return jsonify({'message': 'All fields are required!'}), 400

    new_user = User(username=username, password=password, email = email, role=role)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully!'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Registration failed: {str(e)}'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    user = User.query.filter_by(username=username, password=password).first()

    if user:
        return jsonify({'message': 'Login successful', 'role': user.role})
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

@app.route('/api/menu', methods=['GET'])
def get_menu():
    menu_items = MenuItem.query.all()
    return jsonify([{
        'id': item.id,
        'name': item.name,
        'description': item.description,
        'price': str(item.price),
        'availability': item.availability
    } for item in menu_items])

@app.route('/api/user/menu', methods=['GET'])
def get_user_menu():
    menu_items = MenuItem.query.all()
    return jsonify([{
        'id': item.id,
        'name': item.name,
        'description': item.description,
        'price': str(item.price),
        'availability':item.availability
    } for item in menu_items])

@app.route('/api/admin/menu', methods=['GET'])
def get_admin_menu_items():
    try: @app.route('/api/admin/menu', methods=['POST'])
def
        menu_items = MenuItem.query.all()
        serialized_menu = [item.serialize() for item in menu_items]
        return jsonify(serialized_menu), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    add_menu_item():
    try:
        new_item_data = request.json
        new_item = MenuItem(
            name=new_item_data['name'],
            description=new_item_data.get('description', ''),
            price=float(new_item_data['price']),
            availability=new_item_data.get('availability', True)  # Assuming default availability is True
        )
        db.session.add(new_item)
        db.session.commit()
        return jsonify({'message': 'Menu item added successfully'}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Menu item already exists'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
