#include<iostream>
#include <vector>
#include <cstdlib>
#include <ctime>
using namespace std;

void ShowMenu()
{
	cout << "\n=============GUESS THE NUMBER=============" << endl;
	cout << "1: Play The GAME" << endl;
	cout << "2: View Session Stats:" << endl;
	cout << "3: Exit" << endl;
	cout << "Choose an option: ";
}

int main()
{
	srand(static_cast<unsigned int>(time(0)));

	int totalWins = 0;
	int totalLosses = 0;
	float winPercentage = 0.0f;
	vector<int> guessesPerGame;
	int totalGuesses = 0;
	int totalGames = 0;
	float averageGuessesPerGame = 0.0f;
	int menuChoice = 0;

	ShowMenu();
	cin >> menuChoice;

	while (menuChoice == 1 || menuChoice == 2)
	{
		switch (menuChoice)
		{
		case 1:
		{
			int currentGuess = 0;
			vector<int> previousGuesses;

			cout << "========== Game STARTS ===========" << endl;

			int secretNumber = rand() % 100 + 1;

			for (int attempt = 1; attempt <= 5; attempt++)
			{
				cout << "Guess the number from 1 to 100: ";

				if (!(cin >> currentGuess))
				{
					cout << "Invalid input! Numbers only." << endl;
					cin.clear();
					cin.ignore(1000, '\n');
					attempt--;
					continue;
				}

				if (currentGuess >= 1 && currentGuess <= 100)
				{
					bool repeated = false;
					for (int previous : previousGuesses)
					{
						if (previous == currentGuess)
						{
							repeated = true;
							break;
						}
					}

					if (repeated)
					{
						cout << "You already guessed this number." << endl;
						attempt--;
						continue;
					}

					previousGuesses.push_back(currentGuess);
					int difference = currentGuess - secretNumber;

					if (difference == 0)
					{
						cout << "You won in attempt #" << attempt << "!" << endl;
						totalWins++;
						guessesPerGame.push_back(attempt);
						break;
					}

					if (abs(difference) >= 10)
					{
						if (difference > 0)
							cout << "Too High!" << endl;
						else
							cout << "Too Low!" << endl;
					}
					else if (abs(difference) >= 5)
					{
						cout << "Close!" << endl;
					}
					else
					{
						cout << "Very Close!" << endl;
					}

					if (attempt == 5)
					{
						cout << "You LOST! The number was: " << secretNumber << endl;
						totalLosses++;
						guessesPerGame.push_back(5);
					}
				}
				else
				{
					cout << "Invalid input! Number must be between 1 and 100." << endl;
					attempt--;
				}
			}

			totalGames++;

			ShowMenu();
			cin >> menuChoice;
			break;
		}
		case 2:
		{
			cout << "\nTotal games played: " << totalGames << endl;
			cout << "Total games won: " << totalWins << endl;
			cout << "Total games lost: " << totalLosses << endl;

			if (totalGames > 0)
			{
				winPercentage = (static_cast<float>(totalWins) / totalGames) * 100.0f;
				cout << "Win percentage: " << winPercentage << "%" << endl;

				cout << "\n======== Total guesses made across all games ==========" << endl;
				totalGuesses = 0;

				for (int gameIndex = 0; gameIndex < totalGames; gameIndex++)
				{
					cout << "Game #" << gameIndex + 1 << " - Total guesses: " << guessesPerGame[gameIndex] << endl;
					totalGuesses += guessesPerGame[gameIndex];
				}

				averageGuessesPerGame = static_cast<float>(totalGuesses) / totalGames;
				cout << "\nAverage guesses per game: " << averageGuessesPerGame << endl;
			}

			ShowMenu();
			cin >> menuChoice;
			break;
		}
		default:
			// Any other input breaks out of the loop and ends the game
			menuChoice = 3;
			break;
		}
	}

	system("pause");
	return 0;
}
