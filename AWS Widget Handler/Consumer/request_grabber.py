import boto3
import logging
from botocore.exceptions import ParamValidationError
from botocore.exceptions import ClientError


# Grabs the first item from the requested source and stores the item
class RequestGrabber:

    # Object initialization, grabs the item from the requested source and source type ('kind'). If no items are found
    # at the source, self.requests remains None
        # source : Location to poll item from
        # kind : Type of source location
    def __init__(self, source, kind):
        self.source = source
        self.request = None  # Request object pulled from AWS
        if kind == 's3':  # Handle kind : S3
            self.grab_s3()
        elif kind == 'sqs':  # Handle kind : SQS
            self.grab_sqs()

    # Grabs the object list of size 1 from the self.source S3 bucket and stores the object as self.request
    def grab_s3(self):
        client = boto3.client('s3')
        try:
            self.request = client.list_objects_v2(Bucket=self.source, MaxKeys=1)  # Returns a list of S3 objects
        except ParamValidationError:
            # print("Warning: Invalid request source. Bucket name does not match regex.")
            logging.warning("Invalid request source. Bucket name does not match regex.")
        except ClientError:
            # print("Warning: Invalid request source. Bucket does not exist.")
            logging.warning("Invalid request source. Bucket does not exist.")

    # Grabs message list of size 1 from the self.source SQS queue and stores the list as self.request
    def grab_sqs(self):
        resource = boto3.resource('sqs')
        try:
            queue = resource.get_queue_by_name(QueueName=self.source)  # Access the queue by name
            self.request = queue.receive_messages(MaxNumberOfMessages=1)  # Returns a list of message objects
        except ClientError:
            # print("Warning: Invalid request source. Bucket name does not match regex or does not exist")
            logging.warning("Invalid request source. Queue name does not match regex or does not exist.")

    # Returns self.request
    def get_request(self):
        return self.request
