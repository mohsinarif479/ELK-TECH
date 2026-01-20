const readline=require('readline');
const r1=readline.createInterface({input:process.stdin,output:process.stdout});
const r2=readline.createInterface({input:process.stdin,output:process.stdout});

let array=[];
r1.question("Enter the elements of the array separated by spaces:",ans=> {
    array=ans.split(" ").map(Number);
    console.log("The array you entered is:",array);
    
let array2=[];
for(let i=0;i<array.length;i++){
    array2[i]=array[i];
}

//Insertion Sort 
for (i=1;i<array2.length;i++)
    {  
     let j=i;
    while (j > 0 && array2[j] < array2[j - 1]) {
            let temp = array2[j];
            array2[j] = array2[j - 1];
            array2[j - 1] = temp;
            j--;
        }
    }

console.log("The Insertion Sort array is:",array2);

//Bubble Sort
for(let i=0;i<array.length;i++)
    {
        for(let j=0;j<array.length-1;j++)
            {
            if(array[j]>array[j+1])
                {
                    let temp=array[j];
                    array[j]=array[j+1];
                    array[j+1]=temp;
                }
            }
    }
console.log("The Bubble sort array is:",array);

//Merge Sort
let arr=[];
for(let i=0;i<array.length;i++){
    arr[i]=array[i];
}
function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    let mid = Math.floor(arr.length / 2);
    let left = arr.slice(0, mid);
    let right = arr.slice(mid);

    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    let sorted = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            sorted.push(left[i]);
            i++;
        } else {
            sorted.push(right[j]);
            j++;
        }
    }

    // Add remaining elements
    return sorted.concat(left.slice(i)).concat(right.slice(j));
}
let result = mergeSort(array);
console.log("Merge sort array is :", result);

//Linear Search
r1.question("Enter the element to be searched:",ans2=>{
    let target=Number(ans2);
    let found=false;
    for(let i=0;i<array.length;i++){
        if(array[i]===target){
            found=true;
            console.log("Element found at index:",i);
            break;
        }   
        else{
            found=false;
        }
    }
    if(!found){
        console.log("Element not found in the array");
    }
    
//Binary Search
 r1.question("Enter the element to be searched using Binary Search:",ans3=>{
    let target=Number(ans3);
    let left=0;
    let right=array.length-1;
    let found=false;
    while(left<=right){
        let mid=Math.floor((left+right)/2);
        if(array[mid]===target){
            found=true;
            console.log("Element found at index:",mid);
            break;
        }
        else if(array[mid]<target){
            left=mid+1;
        }
        else{
            right=mid-1;
        }
    }
    if(!found){
        console.log("Element not found in the array");
    }
r1.close();
});
});
});