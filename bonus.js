function findKthPositive(arr, k) {
    let missingCount = 0;
    let current = 1;
    let i = 0;

    while (true) {
        if (i < arr.length && arr[i] === current) {
            i++;
        } else {
            missingCount++;
            if (missingCount === k) {
                return (`The ${k} missing positive integer is: ${current}`);
            }
        }
        current++;
    }
}


const arr = [2, 3, 4, 7, 11];
const k = 5;
console.log(findKthPositive(arr, k));