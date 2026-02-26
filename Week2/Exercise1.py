array=[]
array2=[]
count=int(input("Enter number of elements: "))
for i in range(count):
    element=int(input("Enter element: "))
    array.append(element)

print("Original array:", array)
array2=array.copy()
# insertion sort
for k in range(1,len(array2)):
    j=k
    while(j>0 and array2[j] < array2[j-1]):
            temp=array2[j]
            array2[j]=array2[j-1]
            array2[j-1]=temp
            j=j-1

print("Insertion Sort Array:", array2)

# bubble sort
for i in range(len(array)):
    j=0
    while(j<=len(array)-2):
        if(array[j]>array[j+1]):
            temp=array[j]
            array[j]=array[j+1]
            array[j+1]=temp
        j=j+1
print("Bubble Sort Array:", array)

# merge sort
array3=array.copy()
def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        L = arr[:mid]
        R = arr[mid:]

        merge_sort(L)
        merge_sort(R)

        i = j = k = 0

        while i < len(L) and j < len(R):
            if L[i] < R[j]:
                arr[k] = L[i]
                i += 1
            else:
                arr[k] = R[j]
                j += 1
            k += 1

        while i < len(L):
            arr[k] = L[i]
            i += 1
            k += 1

        while j < len(R):
            arr[k] = R[j]
            j += 1
            k += 1
merge_sort(array3)
print("Merge Sort Array:", array3)


# Linear Search
target=int(input("Enter element to search (Linear Search): "))
for i in range(len(array)):
    if(array[i]==target):
        print("Element found at index (Linear Search):",i)
        break
    else:
        print("Element not found (Linear Search)")

# Binary Search
target=int(input("Enter element to search (Binary Search): "))
left=0
right=len(array3)-1
found=False
while left<=right:
    mid=(left+right)//2
    if(array3[mid]==target):
        print("Element found at index (Binary Search):",mid)
        found=True
        break
    elif(array3[mid]<target):
        left=mid+1
    else:
        right=mid-1
    
if not found:
    print("Element not found (Binary Search)")
