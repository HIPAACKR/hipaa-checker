# API Documentation

## Base URL
https://hipaachecker.health/


### Sign Up
*POST* `api/v1/registrations`

Payload
```
{
  "user[email]": "test@email.com",
  "user[password]": "password",
  "user[is_accept_terms]": true,
  "user[password_confirmation]": "password",
  "user[first_name]": "John",
  "user[last_name]": "Doe",
  "user[is_individual]": 0,
  "user[organization_id]": 3
}
```
<br/> From the payload `"user[is_individual]": 0` means organizational user, and 1 means Individual user. If the user selects Organizational, at that time, the system should get the organization list by calling another API `api/v1/organizations`. You will find the documentation for this API below. If registration is for an individual user, then `"user[organization_id]"` can be null.


<br/><br/>Response:
```
{
    "message": "User Registration successfull"
}
```
A confirmation email will be sent to the user's email address.
<br/>Error Response:
<be/> If email already exists in the system:
```
{
  "errors": [
        "Email has already been taken."
    ]
}
```

### Confirmation link confirmation
*POST* `api/v1/confirmations?confirmation_token=TOKEN`

Response:
```
{
    "message": "User confirmed successfully"
}
```

### Remove user account completely
*DELETE* `/api/v1/user/0`

Response:
```
{
    "message": "User account was removed successfully"
}
```

### Get the Organization List during Sign-up
*GET* `api/v1/organizations`

Payload
```
nothing
```

Response:
```
[
    {
        "id": 1,
        "name": "Org_1"
    },
    {
        "id": 2,
        "name": "Org_2"
    },
    {
        "id": 3,
        "name": "Org_3"
    }
]
```


### Sign in
*POST* `api/v1/sessions`

Payload
```
{
  email: "user@example.com",
  password: "password"
}
```

Response:
```
{
    "jwt_token": "token",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
}
```
The token is valid for 4 hours only. If it expires, log in again to get a new token.

### Forgot Password
*POST* `api/v1/passwords`

Payload
```
{
  email: "user@example.com"
}
```

Response:
```
{
    "message": "Password reset instructions sent"
}
```
An email with reset password instructions will be sent to the user's email address. The HTTP response code will be <b>200 OK</b>.
<br/>If the user's email is not valid, the Response will be:
```
{
    "errors": [
            "Email not found."
        ]
}
```
HTTP response code will be <b>404</b>


### Reset Password
*PUT* `api/v1/passwords/token`
<br/>The token can be found in the email instructions URL.
<br/>Payload
```
{
  "password": "newPassword",
  "password_confirmation": "newPassword"
}
```

Response:
```
{
    "message": "Password has been reset."
}
```
A success message will be sent with the HTTP response code, which will be <b>200 OK</b>.
<br/>If the password is not valid, the Response will be:
```
{
    "errors": [
        "Password confirmation doesn't match Password."
    ]
}
```

### Get Logged in users details
*GET* `/api/v1/user`

Payload in Header
```
{
  Authorization: "Bearer AUTH_TOKEN",
}
```

Response:
```
{
    "user": {
        "id": 10000,
        "email": "email@gmail.com",
        "first_name": "John",
        "last_name": "Doe",
        "app_checking_count": 20,
        "created_at": "2023-08-26T15:18:51.188Z",
        "is_accept_terms": true,
        "user_uploads_count": 11,
        "total_high_risks": 13,
        "total_medium_risks": 195,
        "total_low_risks": 1036,
        "total_no_risks": 1344,
        "organization": {
            "name": "individual",
            "stripe_subscription_id": null
        },
        "default_card": {
            "id": "card_1QBnEEKDJmui1GKTrOx3DDqg",
            "object": "card",
            "address_city": null,
            "address_country": null,
            "address_line1": null,
            "address_line1_check": null,
            "address_line2": null,
            "address_state": null,
            "address_zip": null,
            "address_zip_check": null,
            "brand": "Visa",
            "country": "US",
            "customer": "cus_R2NXCmhfvZQ3o4",
            "cvc_check": "pass",
            "dynamic_last4": null,
            "exp_month": 10,
            "exp_year": 2025,
            "fingerprint": "FyqBLKIZCYzQQW7F",
            "funding": "credit",
            "last4": "4242",
            "metadata": {},
            "name": null,
            "tokenization_method": null,
            "wallet": null
        }
    }
}
```

### Get uploaded applications of logged in user
*GET* `/api/v1/user_uploads/`

Payload in Header
```
{
  Authorization: "Bearer AUTH_TOKEN",
}
```

Response:
```
{
    "user_uploads": [
        {
            "id": 119,
            "upload_type": "Healthcare",
            "platform": "apk",
            "environment": "app",
            "created_at": "2023-09-06T11:12:30.028Z",
            "project_name": null,
            "project_identifier": null,
            "hipaa_score": 60
        },
        {
            "id": 120,
            "upload_type": "Healthcare",
            "platform": "laravel",
            "environment": "web application",
            "created_at": "2023-09-06T11:20:22.108Z",
            "project_name": null,
            "project_identifier": null,
            "hipaa_score": 60
        },
    ]
}
```

### Get HIPAA report of an uploaded applications of th logged in user
*GET* `/api/v1/user_uploads/119`

Payload in Header
```
{
  Authorization: "Bearer AUTH_TOKEN",
}
```

Response:
```
{
    "user_upload": {
        "id": 726,
        "upload_type": "Healthcare",
        "platform": "spring",
        "environment": "web application",
        "created_at": "2024-05-22T02:07:11.490Z",
        "project_name": null,
        "project_identifier": null,
        "hipaa_score": 60,
        "analyzed_results": [
            {
                "id": 383545,
                "filepath": "PATH../extracted/726/java_sources/EHRS-Spring-Backend-master/spring/src/main/java/com/company/project/service/AutomatedEmailService.java",
                "filename": "AutomatedEmailService.java",
                "description": "Is this application maintain transactions for data",
                "created_at": "2024-05-22T02:07:20.398Z",
                "user_upload_id": 726,
                "pattern": [
                    "\\@Transactional"
                ],
                "matched_data": [
                    [
                        "{\"lineNumber\":22,\"codeSegment\":\"@Transactional\"}"
                    ]
                ],
                "rule_name": "data_integrity",
                "severity": 0
            },
            {
                "id": 383544,
                "filepath": "PATH../extracted/726/java_sources/EHRS-Spring-Backend-master/spring/src/main/java/com/company/project/service/impl/UserServiceImpl.java",
                "filename": "UserServiceImpl.java",
                "description": "Is this application maintain transactions for data",
                "created_at": "2024-05-22T02:07:20.393Z",
                "user_upload_id": 726,
                "pattern": [
                    "\\@Transactional"
                ],
                "matched_data": [
                    [
                        "{\"lineNumber\":20,\"codeSegment\":\"@Transactional\"}"
                    ]
                ],
                "rule_name": "data_integrity",
                "severity": 0
            },
        ]
    }
}
```
### Get rule wise HIPAA report of an uploaded application
*GET* `api/v1/user_uploads/<USER_UPLOAD_ID>/rule_wise`

Payload in Header
```
{
  Authorization: "Bearer AUTH_TOKEN",
}
```

Response
```
{
    "user_upload": {
        "id": 34,
        "upload_type": "Healthcare",
        "platform": "apk",
        "environment": "app",
        "created_at": "2024-05-20T04:47:08.396Z",
        "project_name": null,
        "project_identifier": null,
        "high_risk_percentage": 0.0,
        "medium_risk_percentage": 0.0,
        "low_risk_percentage": 0.0,
        "no_risk_percentage": 100.0,
        "hipaa_score": 60,
        "analyzed_reports": [
            {
                "rule_id": "encryption_decryption",
                "rule_name": "Implementation of encryption and decryption",
                "sub_rules": [
                    {
                        "description": "This App uses Message Digest (MD) algorithm encryption.",
                        "severity": 1,
                        "files": [
                            {
                                "file_name": "ByteString.java",
                                "file_path": "/Users/abdul/projects/hipaachecker.health/extracted/34/java_sources/okio/ByteString.java",
                                "file_path_encoded": "%2FUsers%2Fabdul%2Fprojects%2Fhipaachecker.health%2Fextracted%2F34%2Fjava_sources%2Fio%2Fgrpc%2Fokhttp%2Finternal%2FUtil.java"
                                "matched_data": [
                                    [
                                        "{\"lineNumber\":17,\"codeSegment\":\"import java.security.MessageDigest;\"}"
                                    ]
                                ]
                            }
                        ],
                        "count": 1,
                        "checked": true
                    },
                    {
                        "description": "This App uses Message Digest 5 (MD5) algorithm encryption.",
                        "severity": 2,
                        "files": [],
                        "count": 0,
                        "checked": false
                    },
                ]
            },
            {
                "rule_id": "audit",
                "rule_name": "Implementing audit controls to record and examine activity that contain or use PHI",
                "sub_rules": []
            },
            {
                "rule_id": "phi_encryption",
                "rule_name": "Encrypt PHI whenever appropriate",
                "sub_rules": []
            },
            {
                "rule_id": "unique_id",
                "rule_name": "Assigning unique id for identifying and tracking patient’s identity",
                "sub_rules": []
            },
            {
                "rule_id": "user_inactivity",
                "rule_name": "Implementing procedures to terminate a session after a predetermined time of inactivity",
                "sub_rules": []
            },
            {
                "rule_id": "user_authentication",
                "rule_name": "Implement authentication procedures to verify that a person or entity seeking access to PHI is the one claimed",
                "sub_rules": []
            },
            {
                "rule_id": "authorization",
                "rule_name": "Providing access controls to allow PHI access only to persons or programs that have been granted access rights",
                "sub_rules": []
            },
            {
                "rule_id": "guard_against_com_network",
                "rule_name": "Implement technical security measures to guard against unauthorized access to PHI that is being transmitted over communications network",
                "sub_rules": []
            },
            {
                "rule_id": "data_integrity",
                "rule_name": "Maintain PHI data integrity to prevent improper alteration or destruction",
                "sub_rules": []
            },
            {
                "rule_id": "authorization_for_destruction",
                "rule_name": "Mechanisms to corroborate that PHI has not been altered or destroyed in an unauthorized manner",
                "sub_rules": []
            },
            {
            "rule_id": "transmition_secuirity",
            "rule_name": "Implement measures to ensure that transmitted PHI is not improperly modified without detection until disposed of",
            "sub_rules": [
                {
                    "description": "This Application uses secure connection to transmit data.",
                    "severity": 0,
                    "files": [],
                    "count": 0,
                    "checked": false
                },
                {
                    "description": "This Application uses checking the revocation status of certificates with the PKIX algorithm.",
                    "severity": 0,
                    "files": [],
                    "count": 0,
                    "checked": false
                },
                {
                    "description": "This Application uses Authorization header to secure external API calls.",
                    "severity": 0,
                    "files": [],
                    "count": 0,
                    "checked": false
                }
            ]
            }
        ]
    }
}
```

### Get file wise HIPAA report
*GET* `api/v1/user_uploads/<USER_UPLOAD_ID>/file_wise?file_path_encoded=<ENCODED_FILE_PATH>`

Payload in Header
```
{
  Authorization: "Bearer AUTH_TOKEN",
}
```

Response
```
{
    "user_upload": {
        "id": 34,
        "name": "Webmd  symptom checker 9.7 apkcombo.com",
        "upload_type": "Healthcare",
        "platform": "apk",
        "environment": "app",
        "created_at": "2024-05-20T04:47:08.396Z",
        "project_name": null,
        "project_identifier": null,
        "high_risk_percentage": 0.0,
        "medium_risk_percentage": 0.0,
        "low_risk_percentage": 0.0,
        "no_risk_percentage": 100.0,
        "hipaa_score": 10,
        "analyzed_results": {
            "filename": "Util.java",
            "filepath": "/Users/abdul/projects/hipaachecker.health/extracted/34/java_sources/io/grpc/okhttp/internal/Util.java",
            "rules": [
                {
                    "rule_id": "encryption_decryption",
                    "description": "Implementation of encryption and decryption",
                    "high_risk_count": 0,
                    "medium_risk_count": 0,
                    "low_risk_count": 0,
                    "no_risk_count": 5,
                    "sub_rules": [
                        {
                            "subrule_id": "md_encryption",
                            "description": "This App uses Message Digest (MD) algorithm encryption.",
                            "severity": 1,
                            "count": 2,
                            "code_segments": [
                                "{\"lineNumber\":12,\"codeSegment\":\"import java.security.MessageDigest;\"}",
                                "{\"lineNumber\":12,\"codeSegment\":\"import java.security.MessageDigest;\"}"
                            ]
                        },
                    ]
                },
                {
                    "rule_id": "audit",
                    "description": "Implementing audit controls to record and examine activity that contain or use PHI",
                    "high_risk_count": 0,
                    "medium_risk_count": 0,
                    "low_risk_count": 0,
                    "no_risk_count": 0,
                    "sub_rules": []
                },
                {
                    "rule_id": "phi_encryption",
                    "description": "Encrypt PHI whenever appropriate",
                    "high_risk_count": 0,
                    "medium_risk_count": 0,
                    "low_risk_count": 0,
                    "no_risk_count": 0,
                    "sub_rules": []
                },
                {
                    "rule_id": "unique_id",
                    "description": "Assigning unique id for identifying and tracking patient’s identity",
                    "high_risk_count": 0,
                    "medium_risk_count": 0,
                    "low_risk_count": 0,
                    "no_risk_count": 0,
                    "sub_rules": []
                },
                {
                    "rule_id": "user_inactivity",
                    "description": "Implementing procedures to terminate a session after a predetermined time of inactivity",
                    "high_risk_count": 0,
                    "medium_risk_count": 0,
                    "low_risk_count": 0,
                    "no_risk_count": 1,
                    "sub_rules": []
                },
                {
                    "rule_id": "user_authentication",
                    "description": "Implement authentication procedures to verify that a person or entity seeking access to PHI is the one claimed",
                    "high_risk_count": 0,
                    "medium_risk_count": 0,
                    "low_risk_count": 0,
                    "no_risk_count": 0,
                    "sub_rules": []
                },
                {
                    "rule_id": "authorization",
                    "description": "Providing access controls to allow PHI access only to persons or programs that have been granted access rights",
                    "high_risk_count": 0,
                    "medium_risk_count": 0,
                    "low_risk_count": 0,
                    "no_risk_count": 0,
                    "sub_rules": []
                },
                {
                    "rule_id": "guard_against_com_network",
                    "description": "Implement technical security measures to guard against unauthorized access to PHI that is being transmitted over communications network",
                    "high_risk_count": 0,
                    "medium_risk_count": 0,
                    "low_risk_count": 0,
                    "no_risk_count": 0,
                    "sub_rules": []
                },
                {
                    "rule_id": "data_integrity",
                    "description": "Maintain PHI data integrity to prevent improper alteration or destruction",
                    "high_risk_count": 0,
                    "medium_risk_count": 0,
                    "low_risk_count": 0,
                    "no_risk_count": 0,
                    "sub_rules": []
                },
                {
                    "rule_id": "authorization_for_destruction",
                    "description": "Mechanisms to corroborate that PHI has not been altered or destroyed in an unauthorized manner",
                    "high_risk_count": 0,
                    "medium_risk_count": 0,
                    "low_risk_count": 0,
                    "no_risk_count": 0,
                    "sub_rules": []
                },
                {
                    "rule_id": "transmition_secuirity",
                    "description": "Implement measures to ensure that transmitted PHI is not improperly modified without detection until disposed of",
                    "high_risk_count": 0,
                    "medium_risk_count": 0,
                    "low_risk_count": 0,
                    "no_risk_count": 0,
                    "sub_rules": []
                }
            ]
        }
    }
}
```

### User Dashboard
*GET* `api/v1/dashboard`

Payload in Header
```
{
  Authorization: "Bearer AUTH_TOKEN",
}
```

Response
```
{
    "dashboard": {
        "user": {
            "id": 1,
            "email": "barek2k2@gmail.com",
            "first_name": "Abdul",
            "last_name": "Barek",
            "app_checking_count": -32,
            "created_at": "2024-04-01T07:18:24.839Z",
            "is_accept_terms": true,
            "user_uploads_count": 1,
            "total_high_risks": 0,
            "total_medium_risks": 0,
            "total_low_risks": 0,
            "total_no_risks": 2480,
            "user_uploads": [
                {
                    "id": 34,
                    "name": "Webmd  symptom checker 9.7 apkcombo.com",
                    "upload_type": "Healthcare",
                    "platform": "apk",
                    "environment": "app",
                    "created_at": "2024-05-20T04:47:08.396Z",
                    "project_name": null,
                    "project_identifier": null,
                    "high_risk_percentage": 0.0,
                    "medium_risk_percentage": 0.0,
                    "low_risk_percentage": 0.0,
                    "no_risk_percentage": 100.0,
                    "hipaa_score": 60
                }
            ],
            "organization": null
        }
    }
}
```
### Upload a new APK or Zip
*POST* `/api/v1/user_uploads/`

Payload in Header
```
{
  Authorization: "Bearer AUTH_TOKEN",
}
```
Payload in Body
```
{
  user_upload: {
    upload_type: 'Healthcare',
    platform: 'apk',
    environment: 'app',
    file: FILE
  }
}
```

if environment is `app`, platform will be `apk` always.
if environment is `web application`, platform will be one of `laravel` or `django` or `ror` or `spring`
While you upload web application make sure its zip.

Response:

```
{
    "id": 779,
    "user_id": 6,
    "created_at": "2024-06-06T18:32:15.382Z",
    "updated_at": "2024-06-06T18:32:15.387Z",
    "upload_type": "Healthcare",
    "platform": "apk",
    "environment": "app",
    "project_name": null,
    "project_identifier": null
}
```

### Extracting APK or Zip
*PUT* `/api/v1/user_uploads/ID/extract`

Payload in Header
```
{
  Authorization: "Bearer AUTH_TOKEN",
}
```

Response:

```
{
    "message": "Extracted successfully"
}
```

### Generate Reports
*PUT* `/api/v1/user_uploads/ID/generate_reports`

Payload in Header
```
{
  Authorization: "Bearer AUTH_TOKEN",
}
```

Response:

```
{}
```

### Github Upload(Public Repo Example)
*POST* `api/v1/github_uploads`

Payload in Header
```
{
  Authorization: "Bearer AUTH_TOKEN",
}
```
Payload in Body
```
{
  github_upload: {
    repo_type: "public",
    platform: "laravel",
    github_url: "GITHUB_HTTPS_URL_FROM_BROWSER_LINK"
  }
}
```

Any error format
```
{
    "errors": [
        "Repo type  is not a valid(use either public or private)"
    ]
}
```
### Subscription
*POST* `/api/v1/subscriptions`
Payload in Header
```
{
  Authorization: "Bearer AUTH_TOKEN",
}
```
```
{
  user: {
    stripe_token: "tok_visa",
    plan_id: "<PLAN_ID>",
  },
  code: <PROMOTIONAL_CODE>
}
```
Here, code is optional, if there is any active promotional code and user may apply it while buying subscription 

Response
```
{
    {
        "message": "Successfully updated subscription"
    }
}
```
If you need to just update the plan, use the following payload
```
{
  user: {
    plan_id: "<NEW_PLAN_ID>",
  }
}
```

## Cancel current subscription
*DELETE* `/api/v1/subscriptions/cancel`

Payload in Header
```
{
  Authorization: "Bearer AUTH_TOKEN",
}
```
Response
```
{
    "message": "Your current subscription is cancelled successfully"
}
```


### Plans (Public)
*GET* `/api/v1/plans`

Response:
```
[
    {
        "id": 1,
        "name": "mos_test",
        "price": "1000.0",
        "interval": "month",
        "user_count": 100,
        "is_active": true,
        "created_at": "2024-08-30T03:29:19.992Z",
        "updated_at": "2024-08-30T03:29:19.992Z",
        "max_upload_quota": 0,
        "limit_per_day": 10,
        "get_hipaa_score": true,
        "get_vulnerability_breakdown": true,
        "get_summerized_reports": true,
        "get_specific_reports": true,
        "view_source_code": true,
        "fix_vulnerabilities": true,
        "support_multiple_device": true,
        "support_customer_service": true,
        "support_dashboard_service": true,
        "support_hipaa_experts": true
    },
    {
        "id": 2,
        "name": "mos_test",
        "price": "1000.0",
        "interval": "month",
        "user_count": 100,
        "is_active": true,
        "created_at": "2024-08-30T03:29:19.992Z",
        "updated_at": "2024-08-30T03:29:19.992Z",
        "max_upload_quota": 0,
        "limit_per_day": 10,
        "get_hipaa_score": true,
        "get_vulnerability_breakdown": true,
        "get_summerized_reports": true,
        "get_specific_reports": true,
        "view_source_code": true,
        "fix_vulnerabilities": true,
        "support_multiple_device": true,
        "support_customer_service": true,
        "support_dashboard_service": true,
        "support_hipaa_experts": true
    }
]
```

### Promotional Codes (Public)
*GET* `/api/v1/promotional_codes`

Response:
```
[
    {
        "code": "20DISCOUNT",
        "discount": "20.0",
        "discount_type": "fixed",
        "promotional_length": 3,
        "expire_date": "2024-08-29"
    },
    {
        "code": "50PERDIS",
        "discount": "50.0",
        "discount_type": "percentage",
        "promotional_length": 1,
        "expire_date": "2024-10-15"
    },
    {
        "code": "40PERDIS",
        "discount": "40.0",
        "discount_type": "percentage",
        "promotional_length": 6,
        "expire_date": "2025-09-17"
    }
]
```

### Gets users credit cards
*GET* `/api/v1/payment_methods`

Payload in Header
```
{
  Authorization: "Bearer AUTH_TOKEN",
}
```
Response:
```
{
    "payment_methods": [
        {
            "id": "card_1QBn1sKDJmui1GKTAUgKlpYf",
            "object": "payment_method",
            "billing_details": {
                "address": {
                    "city": null,
                    "country": null,
                    "line1": null,
                    "line2": null,
                    "postal_code": null,
                    "state": null
                },
                "email": null,
                "name": null,
                "phone": null
            },
            "card": {
                "brand": "visa",
                "checks": {
                    "address_line1_check": null,
                    "address_postal_code_check": null,
                    "cvc_check": "pass"
                },
                "country": "US",
                "display_brand": "visa",
                "exp_month": 10,
                "exp_year": 2025,
                "fingerprint": "FyqBLKIZCYzQQW7F",
                "funding": "credit",
                "generated_from": null,
                "last4": "4242",
                "networks": {
                    "available": [
                        "visa"
                    ],
                    "preferred": null
                },
                "three_d_secure_usage": {
                    "supported": true
                },
                "wallet": null
            },
            "created": 1729384196,
            "customer": "cus_R2NXCmhfvZQ3o4",
            "livemode": false,
            "metadata": {},
            "type": "card"
        }
    ]
}
```

### Adding a credit card
*POST* `api/v1/payment_methods?card_token=tok_visa`

Payload in Header
```
{
  Authorization: "Bearer AUTH_TOKEN",
}
```
Response:
```
{
    "id": "card_1QBn1sKDJmui1GKTAUgKlpYf",
    "object": "card",
    "address_city": null,
    "address_country": null,
    "address_line1": null,
    "address_line1_check": null,
    "address_line2": null,
    "address_state": null,
    "address_zip": null,
    "address_zip_check": null,
    "brand": "Visa",
    "country": "US",
    "customer": "cus_R2NXCmhfvZQ3o4",
    "cvc_check": "pass",
    "dynamic_last4": null,
    "exp_month": 10,
    "exp_year": 2025,
    "fingerprint": "FyqBLKIZCYzQQW7F",
    "funding": "credit",
    "last4": "4242",
    "metadata": {},
    "name": null,
    "tokenization_method": null,
    "wallet": null
}
```
### Removing a credit card
*DELETE* `/api/v1/payment_methods/<CARD_ID>`

Payload in Header
```
{
  Authorization: "Bearer AUTH_TOKEN",
}
```
Response:
```
{
    "message": "Card was deleted"
}
```

### Making a credit card default to charge from.
*PUT* `/api/v1/payment_methods/<CARD_ID>/make_default`

Payload in Header
```
{
  Authorization: "Bearer AUTH_TOKEN",
}
```
Response:
```
{
    "message": "Successfully made this card default"
}
```

### Validating License
Please contact us to create your license key and put this in your machine's user root directory

*POST* `/api/v1/licenses/validate`

Payload in Body
```
{
  license_key: "256 characters of License Key",
}
```
Response:
```
{}
```

### Get list of members
Pulls list of members of an user

*POST* `/api/v1/members`

Payload in Header
```
{
  Authorization: "Bearer AUTH_TOKEN",
}
```

Response:
```
{
    "members": [
        {
            "id": 99,
            "email": "barek@twitter.com",
            "first_name": "Abdul",
            "last_name": "Barek",
            "created_at": "2025-01-12T02:27:51.582Z",
            "is_confirmed": true,
            "has_invitation_accepted": true,
            "roles": [
                {
                    "id": 1,
                    "name": "client"
                }
            ],
            "is_admin": false,
            "uploaded_today_count": 0,
            "uploaded_total_count": 0
        },
    ]
}
```

### Sends an email invitation to an user to register

*POST* `/api/v1/members/invite`

Payload in Header
```
{
  Authorization: "Bearer AUTH_TOKEN",
}

```
Payload in Body
```
{
  email: "<EMAIL>",
}
```

Response:
```
{
    "id": <ID>,
    "email": "<EMAIL>"
}
```

### Resend email invitation to user to register

*POST* `/api/v1/members/<ID>/resend_invitation`

Payload in Header
```
{
  Authorization: "Bearer AUTH_TOKEN",
}
```
Response:
```
{}
```

### Resend email invitation to user to register

*POST* `/api/v1/members/<ID>/resend_invitation`

Payload in Header
```
{
  Authorization: "Bearer AUTH_TOKEN",
}
```
Response:
```
{}
```

### Fetches details of an user

*POST* `/api/v1/members/<ID>`

Payload in Header
```
{
  Authorization: "Bearer AUTH_TOKEN",
}
```
Response:
```
{
    "member": {
        "id": 102,
        "email": "user@abc.com",
        "first_name": null,
        "last_name": null,
        "created_at": "2025-01-12T02:53:15.791Z",
        "is_confirmed": false,
        "has_invitation_accepted": false,
        "roles": [
            {
                "id": 1,
                "name": "client"
            }
        ],
        "is_admin": false,
        "uploaded_today_count": 0,
        "uploaded_total_count": 0
    }
}
```

### Updates an user

*PUT* `/api/v1/members/<ID>`

Payload in Header
```
{
  Authorization: "Bearer AUTH_TOKEN",
}
```
Payload in BODY
```
{
  "member": {
    "first_name": "aaaa",
    "last_name": "bbbb",
    "role_ids": [1,2,5], 
    "is_admin": false
  }
}
```
Response:
```
{
    "member": {
        "id": 102,
        "email": "user@abc.com",
        "first_name": "aaaa",
        "last_name": "bbbb",
        "created_at": "2025-01-12T02:53:15.791Z",
        "is_confirmed": false,
        "has_invitation_accepted": false,
        "roles": [
            {
                "id": 1,
                "name": "client"
            },
            {
                "id": 2,
                "name": "client_manager"
            }
        ],
        "uploaded_today_count": 0,
        "uploaded_total_count": 0
    }
}
```