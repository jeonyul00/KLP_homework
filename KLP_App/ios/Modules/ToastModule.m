//
//  ToastModule.m
//  KLP_App
//
//  Created by 전율 on 8/7/25.
//

#import "ToastModule.h" 
#import <UIKit/UIKit.h>

@implementation ToastModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(showToast : (NSString *)message) {
  dispatch_async(dispatch_get_main_queue(), ^{
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:nil message:message preferredStyle:UIAlertControllerStyleAlert];
    
    UIWindow *keyWindow = nil;
    for (UIWindowScene *scene in UIApplication.sharedApplication.connectedScenes) {
      if (scene.activationState == UISceneActivationStateForegroundActive &&
          [scene isKindOfClass:[UIWindowScene class]]) {
        keyWindow = ((UIWindowScene *)scene).windows.firstObject;
        break;
      }
    }
    
    if (!keyWindow) return;
    
    UIViewController *rootViewController = keyWindow.rootViewController;
    [rootViewController presentViewController:alert animated:YES completion:nil];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2 * NSEC_PER_SEC)),
                   dispatch_get_main_queue(), ^{
      [alert dismissViewControllerAnimated:YES completion:nil];
    });
  });
}

@end
