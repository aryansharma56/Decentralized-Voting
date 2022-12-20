#include <iostream>
#include <vector>
#include <string>
using namespace std;
int solve(int n)
{
    int cnt = 0;
    while (n > 0)
    {
        if (n % 2 == 0)
        {
            n = n / 2;
        }
        else if (n % 5 == 0)
        {
            n = (4 * n) / 5;
        }
        else
        {
            n = n - 1;
        }
        cnt++;
    }
    return cnt;
}
int main()
{
    long long int n;
    cin >> n;
    long long int res = 0;
    while (n > 0)
    {
        if (n % 5 == 0)
        {
            n = n / 5;
        }
        else if (n % 2 == 0)
        {
            n = n / 2;
        }
        else
        {
            n = n - 1;
        }
        res++;
    }
    cout << res << endl;
    return 0;
}