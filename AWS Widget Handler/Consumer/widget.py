import logging


# Creates a widget object from a dict and formats it to the destination type's format
class Widget:

    # Object initialization, creates the widget type of the passed in 'kind' variable. If 'data' is incompatible
    # with the destination type ('kind'), self.output remains empty.
    # data : Dict
    # kind : Destination type to format to
    def __init__(self, data, kind):
        self.input = data
        self.output = {}  # Formatted output of self.input
        self.required_keys = ['widgetId', 'owner']  # List of keys required to be in self.input
        if kind == 's3':  # Handle kind : S3
            self.create_s3_widget()
        elif kind == 'dynamodb':  # Handle kind : DynamoDB
            self.create_dynamo_widget()

    # Creates a widget from self.input into an S3 compatible format
    def create_s3_widget(self):
        try:
            for key in self.required_keys:  # Ensure required keys exist in self.input, return if not
                if key not in self.input:
                    # print("Warning: Provided data is missing a required data property.")
                    logging.warning("Warning: Provided data is missing a required data property.")
                    return
            for key in self.input.keys():  # Iterate through all keys in self.input and add them to self.output dict
                if key != 'type' and key != 'requestId':  # Discard unnecessary request info (type and requestId)
                    if key == 'owner':  # Format value of owner key to use hyphens for cleaner file paths
                        self.output[key] = self.input[key].strip().replace(" ", "-")
                    else:
                        self.output[key] = self.input[key]
        except AttributeError:  # If self.input is empty or data is invalid, skip widget creation
            # print("Warning: Invalid data, skipping widget creation.")
            logging.warning("Invalid data, skipping widget creation.")
        except TypeError:
            # print("Warning: Provided data is not a dict or is not iterable, skipping widget creation.")
            logging.warning("Provided data is not a dict or is not iterable, skipping widget creation.")

    # Creates a widget from self.input into a DynamoDB compatible format, unpacking otherAttributes into their own keys
    def create_dynamo_widget(self):
        try:
            for key in self.required_keys:  # Ensure required keys exist in self.input, return if not
                if key not in self.input:
                    # print("Warning: Provided data is missing a required data property.")
                    logging.warning("Provided data is missing a required data property.")
                    return
            for key in self.input.keys():  # Iterate through all keys in self.input and add them to self.output dict
                if key != 'type' and key != 'requestId':  # Discard unnecessary request info (type and requestId)
                    if key == 'widgetId':  # Change the key 'widgetId' to 'widget_id' to match DynamoDB formatting
                        self.output['widget_id'] = self.input[key]
                    elif key == 'otherAttributes':
                        # Unpack otherAttributes values into their own keys.
                        for k in self.input['otherAttributes']:
                            self.output[k['name']] = k['value']
                    else:
                        self.output[key] = self.input[key]
        except AttributeError:  # If self.input is empty or data is invalid, skip widget creation
            # print("Warning: Invalid data, skipping widget creation.")
            logging.warning("Invalid data, skipping widget creation.")
        except TypeError:
            # print("Warning: Provided data is not a dict or is not iterable, skipping widget creation.")
            logging.warning("Provided data is not a dict or is not iterable, skipping widget creation.")

    # Returns self.input
    def get_input(self):
        return self.input

    # Returns self.output
    def get_output(self):
        return self.output
