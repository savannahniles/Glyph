print("ran python!!")
f = open('myfile','w')
f.write('hi there\n') # python will convert \n to os.linesep
f.close() # you can omit in most cases as the destructor will call if
