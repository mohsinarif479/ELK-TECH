#include<iostream>
#include <vector>
#include <cstdlib>
#include <ctime>
using namespace std;

int main()
{
	srand(time(0));
	int win = 0;
	int loss = 0;
	float win_percentage = 0;
	vector<int> t_guess;
	int total_guess = 0;
	int t_games = 0;
	float AGPG = 0;
	int choose = 0;

	cout << "=============GUESS THE NUMBER=============" << endl;
	cout << "1: Play The GAME" << endl;
	cout << "2: View Session Stats:" << endl;
	cout << "3: Exit" << endl;
	cin >> choose;

	while (choose == 1 || choose == 2)
	{
		if (choose == 1)
		{
			int guess = 0;
			int n_guess = 0;
			vector<int>p_guess;
			cout << "==========Game STARTS===============" << endl;
			int num = rand() % 100 + 1;
			cout << num;
			for (int i = 1; i <= 5; i++)
			{
				cout << "Guess The Number from 1 to 100 :: ";
				if (!(cin >> guess))
				{
					cout << "Invalid input! Numbers only" << endl;
					cin.clear();
					cin.ignore(1000, '\n');
					i--;
					continue;
				}
				if (guess <= 100 && guess >= 1)
				{
					bool repeated = false;
					for (int g : p_guess)
					{
						if (g == guess)
						{
							repeated = true;
							break;
						}
					}
					if (repeated)
					{
						cout << "You already guessed this number"<<endl;
						i--;
						continue;
					}
					p_guess.push_back(guess);
					int diff = guess - num;

					if (diff == 0)
					{
						cout << "You Won in Attempt #" << i << endl;
						win++;
						t_guess.push_back(i);
						break;
					}

					if (abs(diff) >= 10)
					{
						if (diff > 0)
							cout << "Too High!" << endl;
						else
							cout << "Too Low!" << endl;
					}
					else if (abs(diff) >= 5)
					{
						cout << "Close!" << endl;
					}
					else
					{
						cout << "Very Close!" << endl;
					}

					if (i == 5)
					{
						cout << "You LOST! The Number was :: " << num << endl;
						loss++;
						t_guess.push_back(5);
					}
				}
				else 
				{
					cout << "Invalid Input" << endl;
					i--;
				}
			}

			t_games++;

			cout << "\n=============GUESS THE NUMBER=============" << endl;
			cout << "1: Play The GAME" << endl;
			cout << "2: View Session Stats:" << endl;
			cout << "3: Exit" << endl;
			cin >> choose;
		}

		if (choose == 2)
		{
			cout << "\nTotal Games Played :: " << t_games << endl;
			cout << "Total Wins Games :: " << win << endl;
			cout << "Total Loss Games :: " << loss << endl;

			if (t_games > 0)
			{
				win_percentage = (float)win / (win + loss) * 100;
				cout << "Win Percentage :: " << win_percentage << "%" << endl;

				cout << "\n========Total Guess Made All over The games ==========" << endl;
				total_guess = 0;

				for (int j = 0; j < t_games; j++)
				{
					cout << "Game # " << j + 1 << " Total Guess :: " << t_guess[j] << endl;
					total_guess += t_guess[j];
				}

				AGPG = (float)total_guess / t_games;
				cout << "\nAverage Guesses per Game :: " << AGPG << endl;
			}

			cout << "\n=============GUESS THE NUMBER=============" << endl;
			cout << "1: Play The GAME" << endl;
			cout << "2: View Session Stats:" << endl;
			cout << "3: Exit" << endl;
			cin >> choose;
		}
	}
	system("pause");
	return 0;
}
