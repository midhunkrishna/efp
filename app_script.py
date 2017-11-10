import scipy.io
from matplotlib import pyplot as plt
import sys
import os

def file_reader(file_name):
    '''
    This method reads in the data from a csv file
    :param file_name:name of the input file
    :return:
    '''
    complete_data = []
    with open(file_name) as file:
        for row in file:
            row = row.strip()
            row = row.split(",")
            complete_data.append(row)
    return complete_data


def plotter(data, fig):
    lower_limit = 0
    upper_limit = 100
    figure_count = 1
    plt.figure(fig)

    for _ in range(12):
        temp = []
        for index in range(lower_limit, upper_limit):
            temp.append(float(data[index]))
        plt.subplot(4, 3, figure_count)
        plt.plot(temp)
        plt.title("Lead" + str(figure_count))
        lower_limit = upper_limit
        upper_limit = upper_limit + 100
        figure_count = figure_count + 1


def read_data(filename):
    mat = scipy.io.loadmat(filename)

    train_x = mat['train_x']
    train_y = mat['train_y']
    train_coord = mat['train_coord']
    val_x = mat['val_x']
    val_y = mat['val_y']
    val_coord = mat['val_coord']
    test_x = mat['test_x']
    test_y = mat['test_y']
    test_coord = mat['test_coord']
    mean_x = mat['mean_x']
    std_x = mat['std_x']

    return train_x, test_x

def image_exists_at_path(index):
    return os.path.exists('./images/image' + str(index) + '.png')

def main(filename):
    cwd = os.getcwd()
    dirname = 'images'
    directory = cwd + '/' + dirname

    if not os.path.exists(directory):
        os.makedirs(directory)

    train_x, test_x = read_data(filename)

    newpid = os.fork()

    if newpid == 0:
        file = open('/tmp/directory','w')
        file.write(directory)
        file.close

        if os.path.exists('/Applications/efp.app'):
            os.system('open /Applications/efp.app')
        else:
            os.system('open ./efp.app')
    else:
        for i in range(len(train_x)):
            if not (image_exists_at_path(i)):
                plotter(train_x[i], 0)
                plt.savefig('./images/image' + str(i) + '.png')
                plt.close()

if __name__ == '__main__':
    main(sys.argv[1])
