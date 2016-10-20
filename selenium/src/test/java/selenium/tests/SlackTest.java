package selenium.tests;

import static org.junit.Assert.*;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.ChromeDriverManager;

import java.util.LinkedHashMap;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class SlackTest {
    private static WebDriver driver;
    private static final String TEAM_TITLE = "ATeamNoPlanB";
    private static final String BOT_NAME = "infrared";

    
    public static void setUp() throws Exception {
        //driver = new HtmlUnitDriver();
        ChromeDriverManager.getInstance().setup();
        driver = new ChromeDriver();
    }

    
    public static void tearDown() throws Exception {
        driver.close();
        driver.quit();
    }


    @Test
    public void googleExists() throws Exception {
    	setUp();
        driver.get("http://www.google.com");
        assertEquals("Google", driver.getTitle());
        tearDown();
    }

    @Test
    public void testSetVM() throws Exception {
    	
    	setUp();
    	
        LinkedHashMap<String, String> inputs = new LinkedHashMap<String, String>();
        inputs.put("set up vm", "Which OS would you like the VM to have?");
        inputs.put("Ubuntu", "How much GB of RAM would you need?");
        inputs.put("64", "How many vCPUs would you like?");
        inputs.put("5", "How much GB of storage would you need?");
        inputs.put("500 gb", "Okay, I am working on it.");

        String finalOutput = "Your Public DNS name is : " + "ec2-54-158-18-22.compute-1.amazonaws.com"
                + "\nand Public IP : " + "54.158.18.22";


        driver.get("https://ateamnoplanb.slack.com/");

        // Wait until page loads and we can see a sign in button.
        WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

        // Find email and password fields.
        WebElement email = driver.findElement(By.id("email"));
        WebElement pw = driver.findElement(By.id("password"));

        // Type in our test user login info.
        email.sendKeys("pkulkar5@ncsu.edu");
        pw.sendKeys("P2r8a0n3@");

        // Click
        WebElement signin = driver.findElement(By.id("signin_btn"));
        signin.click();

        // Wait until we go to general channel.
        wait.until(ExpectedConditions.titleContains("general"));

        // Switch to #bots channel and wait for it to load.
        driver.get("https://ateamnoplanb.slack.com/messages/@" + BOT_NAME + "/");

        // Type something
        WebElement messageBot = driver.findElement(By.id("message-input"));

        for (String inp : inputs.keySet()) {
            messageBot.sendKeys(inp);
            messageBot.sendKeys(Keys.RETURN);
            Thread.sleep(2000);
            List<WebElement> message_contents = driver.findElements(By.xpath("//span[@class='message_body']"));
            System.out.println(message_contents.get(message_contents.size() - 1).getText());
            assertEquals(message_contents.get(message_contents.size() - 1).getText(), inputs.get(inp));
        }

        Thread.sleep(6000);
        List<WebElement> message_contents = driver.findElements(By.xpath("//span[@class='message_body']"));
        System.out.println(message_contents.get(message_contents.size() - 1).getText());
        assertEquals(message_contents.get(message_contents.size() - 1).getText(), finalOutput);
        
        tearDown();
        
    }

    @Test
    public void testSaveKeys() throws Exception {
    	setUp();
    	
        LinkedHashMap<String, String> inputs = new LinkedHashMap<String, String>();
        inputs.put("save my keys", "Please provide the cloud service provider name for which you want to setup access keys.");
        inputs.put("aws", "Please provide the Access Key Id for your aws.");
        inputs.put("sdfkhjksdf", "Please provide the Secret Access Key for your aws.");
        inputs.put("serserfasdf", "Okay, I am working on it.");

        String finalOutput = "Your keys have been saved successfully!";


        driver.get("https://ateamnoplanb.slack.com/");

        // Wait until page loads and we can see a sign in button.
        WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

        // Find email and password fields.
        WebElement email = driver.findElement(By.id("email"));
        WebElement pw = driver.findElement(By.id("password"));

        // Type in our test user login info.
        email.sendKeys("pkulkar5@ncsu.edu");
        pw.sendKeys("P2r8a0n3@");

        // Click
        WebElement signin = driver.findElement(By.id("signin_btn"));
        signin.click();

        // Wait until we go to general channel.
        wait.until(ExpectedConditions.titleContains("general"));

        // Switch to #bots channel and wait for it to load.
        driver.get("https://ateamnoplanb.slack.com/messages/@" + BOT_NAME + "/");

        // Type something
        WebElement messageBot = driver.findElement(By.id("message-input"));

        for (String inp : inputs.keySet()) {
            messageBot.sendKeys(inp);
            messageBot.sendKeys(Keys.RETURN);
            Thread.sleep(2000);
            List<WebElement> message_contents = driver.findElements(By.xpath("//span[@class='message_body']"));
            System.out.println(message_contents.get(message_contents.size() - 1).getText());
            assertEquals(message_contents.get(message_contents.size() - 1).getText(), inputs.get(inp));
        }

        Thread.sleep(6000);
        List<WebElement> message_contents = driver.findElements(By.xpath("//span[@class='message_body']"));
        System.out.println(message_contents.get(message_contents.size() - 1).getText());
        assertEquals(message_contents.get(message_contents.size() - 1).getText(), finalOutput);
        
        tearDown();
    }

    @Test
    public void testSetCluster() throws Exception {
    	
    	setUp();
    	
        LinkedHashMap<String, String> inputs = new LinkedHashMap<String, String>();
        inputs.put("set up a cluster", "How many nodes do you want your Spark cluster to be?");
        inputs.put("8", "How many vCPUs per node would you like?");
        inputs.put("5", "How much RAM per node in GB would you like?");
        inputs.put("64 gb", "How much storage per node in GB do you want?");
        inputs.put("100", "Okay, I am working on it.");

        String finalOutput = "Spark Cluster Created - \n Zeppelin Link : " + "http://54.158.18.22:8015 " 
        		+ "\n Ambari Server Link : " + "http://54.158.18.23:8080";


        driver.get("https://ateamnoplanb.slack.com/");

        // Wait until page loads and we can see a sign in button.
        WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

        // Find email and password fields.
        WebElement email = driver.findElement(By.id("email"));
        WebElement pw = driver.findElement(By.id("password"));

        // Type in our test user login info.
        email.sendKeys("pkulkar5@ncsu.edu");
        pw.sendKeys("P2r8a0n3@");

        // Click
        WebElement signin = driver.findElement(By.id("signin_btn"));
        signin.click();

        // Wait until we go to general channel.
        wait.until(ExpectedConditions.titleContains("general"));

        // Switch to #bots channel and wait for it to load.
        driver.get("https://ateamnoplanb.slack.com/messages/@" + BOT_NAME + "/");

        // Type something
        WebElement messageBot = driver.findElement(By.id("message-input"));

        for (String inp : inputs.keySet()) {
            messageBot.sendKeys(inp);
            messageBot.sendKeys(Keys.RETURN);
            Thread.sleep(2000);
            List<WebElement> message_contents = driver.findElements(By.xpath("//span[@class='message_body']"));
            System.out.println(message_contents.get(message_contents.size() - 1).getText());
            assertEquals(message_contents.get(message_contents.size() - 1).getText(), inputs.get(inp));
        }

        Thread.sleep(6000);
        List<WebElement> message_contents = driver.findElements(By.xpath("//span[@class='message_body']"));
        System.out.println(message_contents.get(message_contents.size() - 1).getText());
        assertEquals(message_contents.get(message_contents.size() - 1).getText(), finalOutput);
        
        tearDown();
        
    }

}