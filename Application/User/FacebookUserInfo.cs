namespace Application.User
{
  public class FacebookUserInfo
  {
    // we need the email, id, name, 
    // and the picture object which has the data and url which we need
    public string Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public FacebookPictureData Picture { get; set; }
  }

  public class FacebookPictureData
  {
    public FacebookPicture Data { get; set; }
  }

  public class FacebookPicture
  {
    public string Url { get; set; }
  }
}