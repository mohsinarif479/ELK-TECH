# i prefer to you 
array1=[]
count=int(input("Enter number of elements: "))
for i in range(count):
    element=int(input("Enter element: "))
    array1.append(element)

def merge_sort(array):
    if len(array) > 1:
        mid = len(array) // 2
        L = array[0:mid]
        R = array[mid:len(array)-1]

        merge_sort(L)
        merge_sort(R)

        i = j = k = 0

        while i < len(L) and j < len(R):
            if L[i] < R[j]:
                array[k] = L[i]
                i += 1
            else:
                array[k] = R[j]
                j += 1
            k += 1

        while i < len(L):
            array[k] = L[i]
            i += 1
            k += 1

        while j < len(R):
            array[k] = R[j]
            j += 1
            k += 1

    return array

merge_sort(array1)

print("Sorted array using Merge Sort:", array1)

target=int(input("Enter element to search: "))
def binary_search(array, target):
    left, right = 0, len(array) - 1
    while left <= right:
        mid = (left + right) // 2
        if array[mid] == target:
            return mid
        elif array[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

result = binary_search(array1, target)
if result != -1:
    print("Element found at index:", result)
else:
    print("Element not found in the array")

