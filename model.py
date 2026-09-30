from ultralytics import YOLO
import cv2
model_ = YOLO("yolo26n.pt")
cap = cv2.VideoCapture(0)
while cap.isOpened():
    r,fps = cap.read()
    if r== True:
        fps = cv2.flip(fps,1)
        fps = cv2.resize(fps,(640,840))

        cv2.imshow("Window",fps)
        model_.predict(fps)
        if cv2.waitKey(30) & 0xff == ord('p'):
            break
    else:
        break
cv2.destroyAllWindows()
cap.release()