//
//  UNNotificationAttachment+RemoteAttachments.swift
//  TiNotificationServiceExtension
//
//  Created by Hans Knoechel on 23.03.18.
//

import UIKit
import UserNotifications

extension UNNotificationAttachment {
  
  static func create(fileName: String, image: UIImage, options: [NSObject : AnyObject]?) -> UNNotificationAttachment? {
    let fileManager = FileManager.default
    let tmpSubFolderName = ProcessInfo.processInfo.globallyUniqueString
    let tmpSubFolderURL = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent(tmpSubFolderName, isDirectory: true)
    do {
      try fileManager.createDirectory(at: tmpSubFolderURL, withIntermediateDirectories: true, attributes: nil)
      let imageFileIdentifier = fileName // Includes the extension, e.g. "example.gif
      let fileURL = tmpSubFolderURL.appendingPathComponent(imageFileIdentifier)
      guard let imageData = UIImagePNGRepresentation(image) else {
        return nil
      }
      try imageData.write(to: fileURL)
      let imageAttachment = try UNNotificationAttachment.init(identifier: imageFileIdentifier, url: fileURL, options: options)
      return imageAttachment
    } catch {
      print("error " + error.localizedDescription)
    }
    return nil
  }
}
