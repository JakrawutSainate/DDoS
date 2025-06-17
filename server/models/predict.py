# models/predict.py

import sys
import json
import numpy as np
import tensorflow as tf

interpreter = tf.lite.Interpreter(model_path="models/model.tflite")
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

raw_json = sys.argv[1]
features = json.loads(raw_json)

input_data = np.array(features, dtype=np.float32).reshape(1, 1, 78)

interpreter.set_tensor(input_details[0]['index'], input_data)
interpreter.invoke()

output = interpreter.get_tensor(output_details[0]['index'])[0]
pred_idx = int(np.argmax(output))
confidence = float(output[pred_idx])

labels = ["BENIGN", "UDP", "TCP", "WebDDoS", "TFTP", "Other"]

result = {
    "prediction": labels[pred_idx],
    "confidence": confidence
}

print(json.dumps(result))
