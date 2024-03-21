from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")


class Schedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(10), nullable=False)
    hour = db.Column(db.Integer, nullable=False)
    is_available = db.Column(db.Boolean, default=True)
    user_id = db.Column(db.Integer)
    username = db.Column(db.String(50))
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    phonenumber = db.Column(db.String(15))
    last_haircut = db.Column(db.String(50))


@app.route('/api/data/<date>', methods=['GET'])
def get_data_by_date(date):
    data = Schedule.query.filter_by(date=date).all()
    data_list = [
        {'id': item.id, 'hour': str(item.hour), 'is_available': item.is_available, 'username': item.username, 'phonenumber': item.phonenumber}
        for item in data
    ]
    return jsonify(data_list)


@socketio.on('new_data')
def handle_new_data(selected_date):
    data = Schedule.query.filter_by(date=selected_date).all()
    data_list = [
        {'id': item.id, 'hour': str(item.hour), 'is_available': item.is_available, 'username': item.username, 'phonenumber': item.phonenumber}
        for item in data
    ]
    socketio.emit('update_table', data_list)


@app.route('/api/add_data', methods=['PUT'])
def add_data():
    data = request.json
    date = data['date']
    hour = data['hour']

    existing_schedule = Schedule.query.filter_by(date=date, hour=hour).first()

    if existing_schedule:
        existing_schedule.is_available = data.get('is_available')
        existing_schedule.user_id = data.get('user_id')
        existing_schedule.username = data.get('username')
        existing_schedule.first_name = data.get('first_name')
        existing_schedule.last_name = data.get('last_name')
        existing_schedule.phonenumber = data.get('phonenumber')
        existing_schedule.last_haircut = data.get('last_haircut')

        db.session.commit()

        socketio.emit('new_data', date)
        return jsonify({'message': 'Client data updated successfully'})
    else:
        return jsonify({'error': 'Schedule not found for the specified date and hour'})


if __name__ == '__main__':
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True)
