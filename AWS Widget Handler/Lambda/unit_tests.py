import unittest
from widget_request_handler import request_validator
from widget_request_handler import content_validator
from widget_request_handler import send_message


class TestRequestGrabber(unittest.TestCase):
    def test_request_validator(self):
        good_gateway_request = {
            "body": "{\"type\": \"create\",\"requestId\": \"f71bd8ca-a4c6-4aba-8a4b-bcd3461c5651\",\"widgetId\": "
                    "\"6155f688-01bb-4462-8eec-6ba9a8afd3f8\"} "
        }
        bad_gateway_request = {
            "test": "should fail",
            "description": "bad request"
        }
        empty_gateway_request = {}
        invalid_gateway_request = 42

        self.assertEqual(request_validator(good_gateway_request), True)
        self.assertEqual(request_validator(bad_gateway_request), False)
        self.assertEqual(request_validator(empty_gateway_request), False)
        self.assertEqual(request_validator(invalid_gateway_request), False)

    def test_content_validator(self):
        create_body = "{\"type\": \"create\",\"requestId\": \"f71bd8ca-a4c6-4aba-8a4b-bcd3461c5651\",\"widgetId\": " \
                      "\"6155f688-01bb-4462-8eec-6ba9a8afd3f8\",\"owner\": \"Sue Smith\"} "
        delete_body = "{\"type\": \"delete\",\"requestId\": \"f71bd8ca-a4c6-4aba-8a4b-bcd3461c5651\",\"widgetId\": " \
                      "\"6155f688-01bb-4462-8eec-6ba9a8afd3f8\",\"owner\": \"Sue Smith\"} "
        update_body = "{\"type\": \"update\",\"requestId\": \"f71bd8ca-a4c6-4aba-8a4b-bcd3461c5651\",\"widgetId\": " \
                      "\"6155f688-01bb-4462-8eec-6ba9a8afd3f8\",\"owner\": \"Sue Smith\",\"description\": \"loves to " \
                      "dance\"} "
        missing_data_body = "{\"type\": \"create\",\"requestId\": \"f71bd8ca-a4c6-4aba-8a4b-bcd3461c5651\"," \
                            "\"widgetId\": \"6155f688-01bb-4462-8eec-6ba9a8afd3f8\"} "
        empty_body = {}
        invalid_body_data_str = "42"
        invalid_body_data_int = 42

        self.assertEqual(content_validator(create_body), True)
        self.assertEqual(content_validator(delete_body), True)
        self.assertEqual(content_validator(update_body), True)
        self.assertEqual(content_validator(missing_data_body), False)
        self.assertEqual(content_validator(empty_body), False)
        self.assertEqual(content_validator(invalid_body_data_str), False)
        self.assertEqual(content_validator(invalid_body_data_int), False)

    def test_send_message(self):
        queue_url = "https://sqs.us-east-1.amazonaws.com/196047763618/cs5260-test-queue"
        message_test = "{\"type\": \"create\",\"requestId\": \"test-request-id\",\"widgetId\": \"test-widget-id\"," \
                       "\"owner\": \"Test Name\"} "
        response = send_message(message_test, queue_url)
        self.assertTrue(response)


if __name__ == '__main__':
    unittest.main(verbosity=2)
