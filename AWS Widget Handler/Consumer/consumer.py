import sys
import boto3
import json
import datetime
import time
import logging
from widget import Widget
from request_handler import RequestHandler


# Indefinitely processes requests using command line parameter arguments
def process(source, src_type, destination, dst_type):
    while True:
        request = RequestHandler(source, src_type)
        request_data = request.get_data()  # Grabs a dict{} of the request JSON
        if request_data is None:  # If RequestHandler call failed, wait 100ms before polling again
            time.sleep(0.1)
            continue
        else:
            if not request_data:  # Check if request_data dict is empty
                continue
            elif 'type' not in request_data or 'requestId' not in request_data:  # Ensure request has a type and ID
                # print("Warning: Invalid request object.")
                logging.warning("Invalid request object.")
            else:  # Handle request types : create, delete, or update
                if request_data['type'] == 'create':
                    create(request_data, destination, dst_type)
                elif request_data['type'] == 'delete':
                    delete(request_data, destination, dst_type)
                elif request_data['type'] == 'update':
                    update(request_data)
                else:
                    # print("Warning: Request object contains invalid request type.")
                    logging.warning("Request object contains invalid request type.")


# Creates a widget object from a dict places it in the user-provided destination
    # data : Dict
    # destination : Location to place widget
    # dst_type : Destination type
def create(data, destination, dst_type):
    widget = Widget(data, dst_type)  # Grab the formatted widget object : dict
    if widget.get_output():  # Check if widget content is empty (widget failed to process somewhere)
        if dst_type == 's3':  # Handle destination type : S3
            resource = boto3.resource('s3')
            # Create the S3 destination path using the widget owner and ID
            path = "widgets/" + widget.get_output()['owner'] + "/" + widget.get_output()['widgetId']
            # Convert the widget to a JSON -> bytes and then upload to S3
            response = resource.Object(destination, path).put(
                Body=(bytes(json.dumps(widget.get_output()).encode('utf-8'))))
            if response:  # If object was successfully added to S3, print success message.
                print(f"Widget successfully created to {dst_type} location: {destination}.")
                logging.info(f"Widget successfully created to {dst_type} location: {destination}.")
        elif dst_type == 'dynamodb':  # Handle destination type : DynamoDB
            resource = boto3.resource('dynamodb')
            # Place the widget into the DynamoDB table
            response = resource.Table(destination).put_item(Item=widget.get_output())
            if response:  # If item was successfully added to DynamoDB, print success message.
                print(f"Widget successfully created to {dst_type} location: {destination}.")
                logging.info(f"Widget successfully created to {dst_type} location: {destination}.")


# Creates a widget object from a dict, locates, and deletes the corresponding widget from the destination
    # data : Dict
    # destination : Location to place widget
    # dst_type : Destination type
def delete(data, destination, dst_type):
    widget = Widget(data, dst_type)  # Grab the formatted widget object : dict
    if widget.get_output():  # Check if widget content is empty (widget failed to process somewhere)
        if dst_type == 's3':  # Handle destination type : S3
            resource = boto3.resource('s3')
            # Create the S3 key to delete using the widget owner and ID
            path = "widgets/" + widget.get_output()['owner'] + "/" + widget.get_output()['widgetId']
            response = resource.Object(destination, path).delete()  # Delete the object from the destination bucket
            if response:  # If object was successfully deleted, print success message.
                print(f"Widget successfully deleted from {dst_type} location: {destination}.")
                logging.info(f"Widget successfully deleted from {dst_type} location: {destination}.")
        elif dst_type == 'dynamodb':  # Handle destination type : DynamoDB
            resource = boto3.resource('dynamodb')
            # Create the key of the item to delete using the primary key (widget_id) and secondary key (owner)
            key = {'widget_id': widget.get_output()['widget_id'], 'owner': widget.get_output()['owner']}
            response = resource.Table(destination).delete_item(Key=key)  # Delete the item from the destination table
            if response:  # If item was successfully deleted, print success message.
                print(f"Widget successfully deleted from {dst_type} location: {destination}.")
                logging.info(f"Widget successfully deleted from {dst_type} location: {destination}.")


# TODO: Create a widget from the request JSON and update the item if it exists. Log a warning if item does not exist.
def update(data):
    pass


if __name__ == "__main__":
    filename = "consumer-" + datetime.datetime.now().strftime("%Y-%m-%d %H-%M-%S") + ".log"
    logging.basicConfig(filename=filename, level=logging.INFO, format='%(asctime)s:%(levelname)s:%(message)s')
    try:
        """
        sys.argv[1] : Source which application polls for widgets
        sys.argv[2] : Source type, can be s3 or sqs
        sys.argv[3] : Destination which application places processed widgets
        sys.argv[4] : Destination type, can be s3 or dynamodb
        """
        process(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
    except IndexError:
        print("Invalid parameters. Use format: consumer.py -source- -source type- -destination- -destination type-")
