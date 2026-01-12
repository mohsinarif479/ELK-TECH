import package(fmt)
func main() {
  fmt.Println("Enter the name of Developer:")
  var name string
  fmt.Scanln(&name)
  fmt.Printf("Hello, %s!\n", name)
  fmt.Println("Enter The Project Name:")
  var project string
  fmt.Scanln(&project)
  fmt.Printf("Welcome to the %s project!\n", project)
}