import random
import math
import pandas
import numpy
import operator
import copy
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

def loadDataset(filename):
    with open(filename) as file:
        csv_data = []
        for line in file.readlines():
            csv_data.append(line.split(','))
    return csv_data

def main():
    trainingSet = []
    testSet = []
    trainingSet = loadDataset('datafinal.csv')
    testSet = loadDataset('output.csv')
    X_train = []
    X_test = []
    Y_train = []
    Y_test = []
    
    X_train=copy.deepcopy(trainingSet)
    Y_train=copy.deepcopy(trainingSet)
    X_test=copy.deepcopy(testSet)
    Y_test=copy.deepcopy(testSet)
    
    for x in range(len(trainingSet)):
        del X_train[x][0:1]
    
    for x in range(len(trainingSet)):
        del Y_train[x][1:]

    del X_train[0]
    del Y_train[0]
    
    knn = KNeighborsClassifier(n_neighbors=5)
    knn.fit(X_train,Y_train)
    
    y_pred=knn.predict(X_test)

    print(y_pred)
    
main()