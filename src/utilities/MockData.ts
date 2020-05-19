import { ToDoItemImportance, ToDoItemStatus } from "../models/ToDoItem";
import { TimeZone } from "../models/TimeZone";
import { isWorker } from "cluster";
import { ToDoItem, ToDoProvider } from "../ToDoProvider";
import * as axios from "axios";

export class MockData {
  private todoItem: ToDoItem[] = [];
  private httpClient: any;
  private provider: ToDoProvider | undefined;
  constructor() {
    this.httpClient = require("axios").default;
  }

  handleResponse = (response: axios.AxiosResponse) => {
    response.data.value.forEach((element: any) => {
      var listItem = new ToDoItem(
        element.id,
        element.displayName,
        element.isOwner,
        element.isShared,
        element.wellKnownListName
      );
      //if (this.provider) {
      //  this.provider.refresh(listItem);
      // }
      this.todoItem.push(listItem);
    });
  };

  handleError = (error: axios.AxiosError) => {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else {
      console.log(error.message);
    }
  };

  public getData(provider: ToDoProvider): ToDoItem[] {
    this.provider = provider;
    this.httpClient
      .get("https://graph.microsoft.com/beta/me/todo/lists", {
        headers: {
          Authorization:
            "Bearer " +
            "eyJ0eXAiOiJKV1QiLCJub25jZSI6InNfbW4zUVEwbW5uYThrUkNqZWJrT1JQSnhJTklROVpJUkV3d3d5STZTVDAiLCJhbGciOiJSUzI1NiIsIng1dCI6IkN0VHVoTUptRDVNN0RMZHpEMnYyeDNRS1NSWSIsImtpZCI6IkN0VHVoTUptRDVNN0RMZHpEMnYyeDNRS1NSWSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNTg5ODI0ODQ1LCJuYmYiOjE1ODk4MjQ4NDUsImV4cCI6MTU4OTgyODc0NSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFVUUF1LzhQQUFBQVB6UG9kMkVMTHdZVDNDOXpVNUc0NzhnTDBId1ZBdXQ1amJMSmE2SUV5OFA1d2xKdHhxTHVZZkVENXJ6dHljUDBvRkY3U0g2VnNvYjV2a2JXSFYwRzdnPT0iLCJhbXIiOlsicnNhIiwibWZhIl0sImFwcF9kaXNwbGF5bmFtZSI6IkdyYXBoIGV4cGxvcmVyIiwiYXBwaWQiOiJkZThiYzhiNS1kOWY5LTQ4YjEtYThhZC1iNzQ4ZGE3MjUwNjQiLCJhcHBpZGFjciI6IjAiLCJkZXZpY2VpZCI6IjlhYzllMTE2LWE1NjQtNGU1Yy1iZWRjLThjOTg4MjFmZTg1YSIsImZhbWlseV9uYW1lIjoiQWdnYW5pIiwiZ2l2ZW5fbmFtZSI6IlJhamVzaCBLdW1hciIsImlwYWRkciI6IjE4My44My4xMzguMTc4IiwibmFtZSI6IlJhamVzaCBLdW1hciBBZ2dhbmkiLCJvaWQiOiI5MjVkZjZiMC0zY2UxLTRkZGEtYjdlOS0wNTM3Y2Q3ZTM3MzAiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMjE0Njc3MzA4NS05MDMzNjMyODUtNzE5MzQ0NzA3LTE1Njk4NzciLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzNGRkY4NEUzNTQyMiIsInNjcCI6IkNhbGVuZGFycy5SZWFkV3JpdGUgQ29udGFjdHMuUmVhZFdyaXRlIERldmljZU1hbmFnZW1lbnRBcHBzLlJlYWRXcml0ZS5BbGwgRGV2aWNlTWFuYWdlbWVudENvbmZpZ3VyYXRpb24uUmVhZC5BbGwgRGV2aWNlTWFuYWdlbWVudENvbmZpZ3VyYXRpb24uUmVhZFdyaXRlLkFsbCBEZXZpY2VNYW5hZ2VtZW50TWFuYWdlZERldmljZXMuUHJpdmlsZWdlZE9wZXJhdGlvbnMuQWxsIERldmljZU1hbmFnZW1lbnRNYW5hZ2VkRGV2aWNlcy5SZWFkLkFsbCBEZXZpY2VNYW5hZ2VtZW50TWFuYWdlZERldmljZXMuUmVhZFdyaXRlLkFsbCBEZXZpY2VNYW5hZ2VtZW50UkJBQy5SZWFkLkFsbCBEZXZpY2VNYW5hZ2VtZW50UkJBQy5SZWFkV3JpdGUuQWxsIERldmljZU1hbmFnZW1lbnRTZXJ2aWNlQ29uZmlnLlJlYWQuQWxsIERldmljZU1hbmFnZW1lbnRTZXJ2aWNlQ29uZmlnLlJlYWRXcml0ZS5BbGwgRGlyZWN0b3J5LkFjY2Vzc0FzVXNlci5BbGwgRGlyZWN0b3J5LlJlYWRXcml0ZS5BbGwgRmlsZXMuUmVhZFdyaXRlLkFsbCBHcm91cC5SZWFkV3JpdGUuQWxsIElkZW50aXR5Umlza0V2ZW50LlJlYWQuQWxsIE1haWwuUmVhZFdyaXRlIE1haWxib3hTZXR0aW5ncy5SZWFkV3JpdGUgTm90ZXMuUmVhZFdyaXRlLkFsbCBvcGVuaWQgUGVvcGxlLlJlYWQgcHJvZmlsZSBSZXBvcnRzLlJlYWQuQWxsIFNpdGVzLlJlYWRXcml0ZS5BbGwgVGFza3MuUmVhZFdyaXRlIFVzZXIuUmVhZCBVc2VyLlJlYWRCYXNpYy5BbGwgVXNlci5SZWFkV3JpdGUgVXNlci5SZWFkV3JpdGUuQWxsIGVtYWlsIiwic2lnbmluX3N0YXRlIjpbImR2Y19tbmdkIiwiZHZjX2NtcCIsImR2Y19kbWpkIiwia21zaSJdLCJzdWIiOiJkM0t5ZlpKNmFlLUhLM3V6OVVQQThNY0ZsRkRjSlFGM0MteF9SSjA0V2NvIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidW5pcXVlX25hbWUiOiJyYWFnZ2FuaUBtaWNyb3NvZnQuY29tIiwidXBuIjoicmFhZ2dhbmlAbWljcm9zb2Z0LmNvbSIsInV0aSI6ImV1N05RUFBPbTB1ZFN6X0pyUk5fQUEiLCJ2ZXIiOiIxLjAiLCJ4bXNfc3QiOnsic3ViIjoidmtDakZkNDZHTVVaam1CYm13Q1dPZDRPWlQ1SEpCNmNPVUU0OV93VTI1OCJ9LCJ4bXNfdGNkdCI6MTI4OTI0MTU0N30.U8som07ZT2S_yIdirHmhMsxp4gmxZWjQlvKdoPg5gVQYBaJ6yWKvYo2dm3poeJ8ObNw7TY25L4sBkgoN_K8bG1Ytv49cbZkV64xt5n0WMy4DrCgcmC6dmPSC87ZZP48BE6N1IT__iY8tPOHCAJbfxlv-FcyPPv8dXgNzl9ewW-cEY9g5_c24NMQrboFNWoqEec7z5lZ1gwvd096CpBR58QlH3JUXTQnQfUdZqsO6myiXjrYzBKXC3DUVuGRoAqlePSxMiRkRYYvDsXQwGvOXNu5pi2uw3WzZ8JQ1hWjad3S2M0fLzKA3iKyxXWmNmr0y9zizOTmevUQuCLGCaXXUQg", //the token is a variable which holds the token
        },
      })
      .then(this.handleResponse)
      .catch(this.handleError);

    //    this.populateTasks();
    //    this.populateFlaggedEmails();
    return this.todoItem;
  }

  private populateTasks() {
    var defaultTasksList = new ToDoItem(
      "1_AAMkADNjZjQxOWU0LThiNzctNDlhOC1iNTM5LWUxMDA4OTZiOTc5ZgAuAAAAAAA5mBoHDfNWRaP--opJjKXGAQBtQpkFnUZ3R47jgf39pUnDAAAANp0uAAA=",
      "Tasks",
      true,
      false,
      "defaultList"
    );
    defaultTasksList.children = [];
    var task1 = new ToDoItem(
      "2_AAMkADNjZjQxOWU0LThiNzctNDlhOC1iNTM5LWUxMDA4OTZiOTc5ZgBGAAAAAAA5mBoHDfNWRaP--opJjKXGBwBtQpkFnUZ3R47jgf39pUnDAAAANp0uAACXu-_HCID9Q4OFzDCWsjFqAALrzD8NAAA=",
      "First Task",
      false,
      false,
      ""
    );
    task1.importance = ToDoItemImportance.normal;
    task1.isReminderOn = false;

    var task2 = new ToDoItem(
      "3_AAMkADNjZjQxOWU0LThiNzctNDlhOC1iNTM5LWUxMDA4OTZiOTc5ZgBGAAAAAAA5mBoHDfNWRaP--opJjKXGBwBtQpkFnUZ3R47jgf39pUnDAAAANp0uAACXu-_HCID9Q4OFzDCWsjFqAALrzD8NAAA=",
      "Second Task",
      false,
      false,
      ""
    );
    task2.importance = ToDoItemImportance.normal;
    task2.isReminderOn = false;

    defaultTasksList.children.push(task1);
    defaultTasksList.children.push(task2);
    this.todoItem.push(defaultTasksList);
  }

  private populateFlaggedEmails() {
    var flaggedEmailsList = new ToDoItem(
      "4_AAMkADNjZjQxOWU0LThiNzctNDlhOC1iNTM5LWUxMDA4OTZiOTc5ZgAuAAAAAAA5mBoHDfNWRaP--opJjKXGAQBtQpkFnUZ3R47jgf39pUnDAAAANp0uAAA=",
      "Flagged Emails",
      true,
      false,
      "flaggedEmails"
    );
    flaggedEmailsList.children = [];
    var task1 = new ToDoItem(
      "5_AAMkADNjZjQxOWU0LThiNzctNDlhOC1iNTM5LWUxMDA4OTZiOTc5ZgBGAAAAAAA5mBoHDfNWRaP--opJjKXGBwBtQpkFnUZ3R47jgf39pUnDAAAANp0uAACXu-_HCID9Q4OFzDCWsjFqAALrzD8NAAA=",
      "Flagged Emails - First Task",
      false,
      false,
      ""
    );
    task1.importance = ToDoItemImportance.normal;
    task1.isReminderOn = false;

    var task2 = new ToDoItem(
      "6_AAMkADNjZjQxOWU0LThiNzctNDlhOC1iNTM5LWUxMDA4OTZiOTc5ZgBGAAAAAAA5mBoHDfNWRaP--opJjKXGBwBtQpkFnUZ3R47jgf39pUnDAAAANp0uAACXu-_HCID9Q4OFzDCWsjFqAALrzD8NAAA=",
      "Flagged Emails - Second Task",
      false,
      false,
      ""
    );
    task2.importance = ToDoItemImportance.normal;
    task2.isReminderOn = false;

    flaggedEmailsList.children.push(task1);
    flaggedEmailsList.children.push(task2);
    this.todoItem.push(flaggedEmailsList);
  }
}
