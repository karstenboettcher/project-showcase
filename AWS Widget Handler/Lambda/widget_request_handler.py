import boto3

QUEUE_URL = None
sqs = boto3.client('sqs')


# Receives an API Gateway event, validates the event, and sends the message to an SQS queue. The method then returns
# the result of that Gateway event
    # event : API Gateway event
    # context : API Gateway context
def widget_request_handler(event, context):
    if not request_validator(event):
        return get_error_message("Event has no body")

    body = event['body']
    if content_validator(body):
        msg = send_message(body)
        if msg is not None:
            return get_success_message()
        else:
            return get_error_message("Invalid Queue URL")

    else:
        return get_error_message("Invalid event body")


# Takes an API Gateway event and validates that the event has a body attribute
    # request : an API Gateway event (a JSON object)
def request_validator(request):
    try:
        return True if 'body' in request else False
    except TypeError:
        return False


# Takes the a JSON object and validates that it has the required keys
    # body : a JSON object
def content_validator(body):
    try:
        required_keys = ['type', 'requestId', 'widgetId', 'owner']
        for key in required_keys:
            if key not in body:
                return False
        return True
    except TypeError:
        return False


# Sends a message to an SQS queue. If the user doesn't pass one in, it defaults to the one provided in the file
    # body : a JSON object
    # q_url : URL of the SQS queue
def send_message(body, q_url=QUEUE_URL):
    if q_url is None:
        print("Please enter a valid queue URL.")
        return
    queue = sqs.send_message(
        QueueUrl=QUEUE_URL,
        MessageBody=body
    )
    return queue


# Returns an error message object
    # message : error message body
def get_error_message(message):
    return {
        "statusCode": 499,
        "headers": {
            "Content-Type": "text/plain",
            "x-amzn-ErrorType": 499
        },
        "isBase64Encoded": False,
        "body": f"{499}: {message}"
    }


# Returns a success message object
def get_success_message():
    return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "isBase64Encoded": False,
            "body": "Success"
        }

