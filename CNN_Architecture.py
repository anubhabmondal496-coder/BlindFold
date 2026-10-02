import tensorflow as tf
from tensorflow import keras
from keras import models, layers
from keras.layers import Input, Conv2D, MaxPooling2D, Dense, Flatten

def model_architecture(num_classes=6):
    model = models.Sequential([
        Input(shape=(128, 128, 3)),
        Conv2D(filters=32, kernel_size=(3, 3), activation='relu'),
        MaxPooling2D(pool_size=(2, 2)),

        Conv2D(filters=64, kernel_size=(3, 3), activation='relu'),
        MaxPooling2D(pool_size=(2, 2)),

        Conv2D(filters=128, kernel_size=(3, 3), activation='relu'),
        MaxPooling2D(pool_size=(2, 2)),

        Flatten(),

        Dense(units=256, activation='relu'),
        layers.Dropout(0.5),
        Dense(units=128, activation='relu'),
        layers.Dropout(0.5),
        Dense(units=64, activation='relu'),
        layers.Dropout(0.25),
        Dense(units=32, activation='relu'),
        layers.Dropout(0.25),

        Dense(units=num_classes, activation='softmax'),
    ])
    return model
