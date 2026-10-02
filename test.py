import cv2
import numpy as np
import tensorflow as tf
import os

classes = ["10", "20", "50", "100", "200", "500"]
model_path = "Currency_checking_model.h5"
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file '{model_path}' not found in the current directory.")

print(f"Loading model from '{model_path}'...")
model = tf.keras.models.load_model(model_path)
print("Model loaded successfully!")

cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Error: Could not open camera.")
    exit()

print("Webcam started. Press 'q' to quit.")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame.")
        break
    # frame = cv2.flip(frame,1)
    display_frame = frame.copy()

    input_img = cv2.resize(frame, (128, 128))
    input_img = input_img.astype(np.float32) / 255.0
    input_tensor = np.expand_dims(input_img, axis=0)

    # Predict once
    prediction = model.predict(input_tensor, verbose=0)
    predicted_idx = np.argmax(prediction[0])
    confidence = float(prediction[0][predicted_idx]) * 100

    predicted_label = classes[predicted_idx]
    status_text = f"Currency: Rs {predicted_label} ({confidence:.1f}%)"
    
    cv2.rectangle(display_frame, (15, 15), (420, 70), (15, 23, 42), -1)

    cv2.putText(
        display_frame, 
        status_text, 
        (25, 52), 
        cv2.FONT_HERSHEY_SIMPLEX, 
        0.9, 
        (44, 147, 254), 
        2, 
        cv2.LINE_AA
    )

    cv2.imshow("BlindFold - Realtime Currency Scanner", display_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Clean up
cap.release()
cv2.destroyAllWindows()
print("Camera stream closed.")