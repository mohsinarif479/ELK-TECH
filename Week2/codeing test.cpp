#include<iostream>
using namespace std;

int main()
{
    int *arr = new int[5];
    
    // Input pole heights
    for(int i = 0; i < 5; i++) {
        cout << "Enter the Pole Length for position " << i+1 << ": ";
        cin >> arr[i];
    }
    
    // Display input heights
    cout << "Pole heights: ";
    for(int i = 0; i < 5; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
    
    // Brute force approach to find maximum area
    int maxArea = 0;
    int bestLeft = 0, bestRight = 0;
    
    // Check all possible pairs of poles
    for(int i = 0; i < 5; i++) {
        for(int j = i+1; j < 5; j++) {
            // Distance between poles (width)
            int width = j - i;  // in meters (each pole is 1m apart)
            
            // Water height is limited by the shorter pole
            int height = min(arr[i], arr[j]);
            
            // Calculate area
            int area = width * height;
            
            // Update if we found a larger area
            if(area > maxArea) {
                maxArea = area;
                bestLeft = i;
                bestRight = j;
            }
            
            // Debug output for each pair
            cout << "Poles " << i+1 << "(" << arr[i] << "m) & " 
                 << j+1 << "(" << arr[j] << "m): width=" << width 
                 << ", height=" << height << ", area=" << area << endl;
        }
    }
    
    // Display final result
    cout << "\n======================================" << endl;
    cout << "MAXIMUM CONTAINER AREA: " << maxArea << " square meters" << endl;
    cout << "Using poles at positions " << bestLeft+1 << " and " << bestRight+1 << endl;
    cout << "Pole heights: " << arr[bestLeft] << "m and " << arr[bestRight] << "m" << endl;
    cout << "Width between poles: " << (bestRight - bestLeft) << " meters" << endl;
    cout << "Calculation: " << (bestRight - bestLeft) << " × min(" 
         << arr[bestLeft] << ", " << arr[bestRight] << ") = " 
         << (bestRight - bestLeft) << " × " << min(arr[bestLeft], arr[bestRight]) 
         << " = " << maxArea << " m²" << endl;
}