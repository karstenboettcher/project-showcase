import boto3
import json
import logging
from botocore.exceptions import ClientError
from request_grabber import RequestGrabber


# Handles requested items generated by RequestGrabber and converts them from object -> JSON -> dict
class RequestHandler:

    # Object initialization, converts the items generated from RequestGrabber into a dict for its source type ('kind').
    # If no items are generated by RequestGrabber, self.data remains None
        # source : Location to poll object from
        # kind : Type of source location
    def __init__(self, source, kind):
        self.source = source
        self.request = RequestGrabber(source, kind)  # Generates item from source
        self.data = None  # Dict generated from self.request item
        if self.request.get_request() is not None:  # Ensure self.request isn't empty
            if kind == 's3':  # Handle kind : S3
                self.handle_s3()
            elif kind == 'sqs':  # Handle kind : SQS
                self.handle_sqs()
        else:
            # print("Warning: Invalid request source type.")
            logging.warning("Invalid request source type.")

    # Takes the S3 item info from self.request, locates the object, decodes the object body to a dict, and deletes the
    # request object from the source bucket
    def handle_s3(self):
        if 'Contents' in self.request.get_request():  # Ensure self.request isn't empty
            client = boto3.client('s3')
            resource = boto3.resource('s3')
            try:
                for obj in self.request.get_request()['Contents']:  # Iterate through each object info in request contents
                    get_object = client.get_object(Bucket=self.source, Key=obj['Key'])  # Grab the corresponding S3 object
                    resource.Object(self.source, obj['Key']).delete()  # Delete the request object from S3 source
                    self.data = get_request_data(get_object['Body'].read().decode('utf-8'))  # Convert body to dict
            except ClientError:
                # print("Warning: No object with given key found")
                logging.warning("No object with given key found")
                self.data = {}  # Set self.data to an empty array to indicate no results but prevent time.sleep call

    # Takes the list of SQS messages from self.request, grabs the message body, converts it to a dict, and deletes the
    # message from the queue
    def handle_sqs(self):
        if self.request.get_request():  # Ensure self.request isn't empty
            for req in self.request.get_request():  # Iterate through each message in list of messages
                self.data = get_request_data(req.body)  # Convert message body to dict
                req.delete()  # Delete the message from the SQS queue

    # Returns self.data
    def get_data(self):
        return self.data


# Converts a JSON object into a dict
    # obj : a JSON object
def get_request_data(obj):
    try:
        data = json.loads(obj)
        return data
    except json.decoder.JSONDecodeError:  # Return nothing if conversion to JSON fails
        # print("Warning: Unable to convert request from JSON, skipping object.")
        logging.warning("Warning: Unable to convert request from JSON, skipping object.")