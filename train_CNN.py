import tensorflow as tf
from tensorflow import keras
from CNN_Architecture import model_architecture
from image_normalization import image_processing, classes

X_train, y_train = image_processing("training")
X_val, y_val = image_processing("validation")
X_test, y_test = image_processing("test")

from keras.callbacks import Callback

class StopAtAccuracy(Callback):

    def on_epoch_end(self, epoch, logs=None):
        accuracy = logs.get("accuracy")

        if accuracy is not None and accuracy >= 0.96:
            print("\nReached 96% training accuracy. Stopping training.")
            self.model.stop_training = True
stop_at_96 = StopAtAccuracy()

model = model_architecture(num_classes=len(classes))
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()
history = model.fit(
    X_train, y_train,
    batch_size=32,
    epochs=40,
    validation_data=(X_val, y_val),
    callbacks= [stop_at_96]
)

model_filename = 'Currency_checking_model.h5'
model.save(model_filename)

test_loss, test_accuracy = model.evaluate(X_test, y_test)
print(f"Final Test Accuracy: {test_accuracy * 100:.2f}% (Loss: {test_loss:.4f})")