#include <iostream>
#include<vector>

using namespace std;

int sum(vector<int> arr) {
  int total = 0;

  for (auto& n : arr) {
    total += n;
  }

  return total;
}

int main(int argc, char const *argv[])
{
  int size, n;
  vector<int> arr;

  cin >> size;
  for (int i = 0; i < size; i++) {
    cin >> n;
    arr.push_back(n);
  }

  cout << sum(arr);

  return 0;
}
