import unittest
from request_grabber import RequestGrabber
from request_handler import RequestHandler
from widget import Widget


class TestRequestGrabber(unittest.TestCase):
    def test_invalid_source(self):
        s3_grabber = RequestGrabber('', 's3')
        sqs_grabber = RequestGrabber('', 'sqs')
        self.assertEqual(s3_grabber.get_request(), None)
        self.assertEqual(sqs_grabber.get_request(), None)

        s3_grabber = RequestGrabber('thisisafakename', 's3')
        sqs_grabber = RequestGrabber('thisisafakename', 'sqs')
        self.assertEqual(s3_grabber.get_request(), None)
        self.assertEqual(sqs_grabber.get_request(), None)

    def test_invalid_kind(self):
        bad_grabber = RequestGrabber('filler-name', '')
        self.assertEqual(bad_grabber.get_request(), None)

        bad_grabber = RequestGrabber('filler-name', 'bad kind')
        self.assertEqual(bad_grabber.get_request(), None)


class TestRequestHandler(unittest.TestCase):
    def test_invalid_source(self):
        s3_handler = RequestHandler('', 's3')
        sqs_handler = RequestHandler('', 'sqs')
        self.assertEqual(s3_handler.get_data(), None)
        self.assertEqual(sqs_handler.get_data(), None)

        s3_handler = RequestHandler('thisisafakename', 's3')
        sqs_handler = RequestHandler('thisisafakename', 'sqs')
        self.assertEqual(s3_handler.get_data(), None)
        self.assertEqual(sqs_handler.get_data(), None)

    def test_invalid_kind(self):
        bad_handler = RequestHandler('filler-name', '')
        self.assertEqual(bad_handler.get_data(), None)

        bad_handler = RequestHandler('filler-name', 'bad kind')
        self.assertEqual(bad_handler.get_data(), None)


class TestWidget(unittest.TestCase):
    def test_invalid_data(self):
        s3_widget = Widget(123, 's3')
        dynamo_widget = Widget(123, 'dynamodb')
        self.assertDictEqual(s3_widget.get_output(), {})
        self.assertDictEqual(dynamo_widget.get_output(), {})

        s3_widget = Widget({}, 's3')
        dynamo_widget = Widget({}, 'dynamodb')
        self.assertDictEqual(s3_widget.get_output(), {})
        self.assertDictEqual(dynamo_widget.get_output(), {})

        data = {'owner': 'me', 'number': 1}
        s3_widget = Widget(data, 's3')
        dynamo_widget = Widget(data, 'dynamodb')
        self.assertDictEqual(s3_widget.get_output(), {})
        self.assertDictEqual(dynamo_widget.get_output(), {})

    def test_invalid_kind(self):
        bad_widget = Widget('filler-name', '')
        self.assertDictEqual(bad_widget.get_output(), {})

        bad_widget = Widget('filler-name', 'bad kind')
        self.assertDictEqual(bad_widget.get_output(), {})


if __name__ == '__main__':
    unittest.main(verbosity=2)
