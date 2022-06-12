import sys, os

def setFile(path,filename):
    global writeFile
    completeName = os.path.join(path, filename)
    writeFile=open(completeName,"w")
def moveUp():
    writeFile.write("move('up')\n")
def moveDown():
    writeFile.write("move('down')\n")
def moveRight():
    writeFile.write("move()\n")
def eatBone():
    writeFile.write("eatBone()\n")
def turn():
    writeFile.write("turn()\n")
def sleep(arg):
    writeFile.write(f"sleep({arg})\n")
def enterHouse():
    writeFile.write("enterHouse()\n")