import java.util.Scanner;
class main {
    static int findSum(int arr[], int n) {
        int sum = 0;
        for (int i = 0; i < n; i++)
        sum += arr[i];
        return sum;
    }

    public static void main(String args[]) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine());
        String inputArr[] = sc.nextLine().split(" ");
        int arr[] = new int[n];
        for (int i = 0; i < n; i++) {
        arr[i] = Integer.parseInt(inputArr[i]);
        }
        System.out.println(findSum(arr, n));
    }
}