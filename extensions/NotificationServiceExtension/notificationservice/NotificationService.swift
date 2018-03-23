//
//  NotificationService.swift
//  TiNotificationServiceExtension
//
//  Created by Hans Knoechel on 23.03.18.
//

import UIKit
import UserNotifications

class NotificationService: UNNotificationServiceExtension {
  
  var contentHandler: ((UNNotificationContent) -> Void)?
  var bestAttemptContent: UNMutableNotificationContent?
  
  override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
    self.contentHandler = contentHandler
    bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
    
    func failEarly() {
      contentHandler(request.content)
    }
    
    guard let content = (request.content.mutableCopy() as? UNMutableNotificationContent) else {
      return failEarly()
    }
    
    guard let attachmentURL = content.userInfo["attachment-url"] as? String, let attachmentName = content.userInfo["attachment-name"] as? String else {
      return failEarly()
    }
    
    do {
      guard let url = URL(string: attachmentURL) else {
        return failEarly()
      }
      let imageData = try Data(contentsOf: url)
      guard let image = UIImage(data: imageData) else {
        return failEarly()
      }
      guard let attachment = UNNotificationAttachment.create(fileName: attachmentName, image: image, options: nil) else { return failEarly() }
      
      content.attachments = [attachment]
      contentHandler(content.copy() as! UNNotificationContent)
    } catch {
      return failEarly()
    }
  }
  
  override func serviceExtensionTimeWillExpire() {
    // Called just before the extension will be terminated by the system.
    // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
    if let contentHandler = contentHandler, let bestAttemptContent =  bestAttemptContent {
      contentHandler(bestAttemptContent)
    }
  }
}

