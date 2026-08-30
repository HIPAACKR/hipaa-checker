import Link from 'next/link';

import EyeCatch from '@/components/eye-catch';
import Heading from '@/components/heading';
import Text from '@/components/text';

import './index.scss';


const TermsConditions = ({ type }) => {
  return (
    <div className='termsConditions'>
      <EyeCatch param='terms-conditions' />
      <div className='termsConditions__body'>
        {/* begining text */}
        <div className='termsConditions__sectionWrapper'>
          {/* last updated at */}
          <Text
            size={type === 'modal' ? 'fs-14' : 'fs-16'}
            color='neutral-600'
          >
            Updated: February 28, 2024
          </Text>
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              PLEASE READ THESE TERMS CAREFULLY BEFORE USING HIPAACHECKER, THEY CONTAIN IMPORTANT
              INFORMATION REGARDING YOUR LEGAL RIGHTS AND OBLIGATIONS, AS WELL AS CONDITIONS,
              INCLUDING, WITHOUT LIMITATION, TERMS AND CONDITIONS RELATED TO WARRANTY DISCLAIMERS,
              LIMITATION OF LIABILITY, LIMITATIONS ON PERIODS FOR ASSERTING ANY CLAIMS,
              INDEMNIFICATION, GOVERNING LAW, AND THESE TERMS REQUIRE BINDING ARBITRATION. BINDING
              ARBITRATION MEANS THAT YOU AGREE TO GIVE UP YOUR RIGHT TO GO TO COURT (INCLUDING IN A
              CLASS ACTION PROCEEDING) TO ASSERT OR DEFEND YOUR RIGHTS UNDER THESE TERMS. Your
              rights will be determined by a NEUTRAL ARBITRATOR and NOT a judge or jury and your
              claims cannot be brought as a class action. Please review Section 16 below entitled
              “Interpretations and Disputes” for the details regarding your agreement to arbitrate
              any disputes with us.
            </Text>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              {' '}
              Welcome to HIPAAChecker available at{' '}
              <Link href='https://hipaachecker.health/'>https://hipaachecker.health/</Link> (the “
              <span className='termsConditions__text-bold'>Service</span>”), which is owned and
              operated by Ubitrix International, Inc. (“
              <span className='termsConditions__text-bold'>we</span>,” “
              <span className='termsConditions__text-bold'>our</span>,” or “
              <span className='termsConditions__text-bold'>us</span>”). The following terms and
              conditions of use (the “<span className='termsConditions__text-bold'>Terms</span>”)
              govern your access to and use of the Service; pages within the Service and any
              information, material, or content made available on or through the Service; and all
              other communications provided by us.
            </Text>

            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              BY ACCESSING OR USING THE SERVICE, YOU (A) ACKNOWLEDGE THAT YOU HAVE READ AND
              UNDERSTAND THESE TERMS; (B) REPRESENT THAT YOU ARE 18 YEARS OF AGE OR OLDER; AND (C)
              ACCEPT THESE TERMS AND AGREE THAT YOU ARE LEGALLY BOUND BY THESE TERMS. If you do not
              agree to these Terms, then you are expressly prohibited from using the Service and you
              must discontinue use immediately.
            </Text>
          </div>
        </div>

        {/* 1 Changes to the Service */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'1. Changes to the Service'}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              We reserve the right to change, modify, or discontinue the Service or any portion of
              the Service, including any and all content, at any time, without notice to you. We
              reserve the right, in our sole discretion, to update, revise, supplement and to
              otherwise modify these Terms, and to impose new or additional terms and conditions.
              Such updates, revisions, supplements, modifications and additional rules, policies,
              terms, and conditions shall be effective immediately and incorporated into these Terms
              upon notice thereof, which may be given by any reasonable means including by posting
              updates to this webpage and changing the “Last Updated” date at the top of this
              webpage. Your continued use of the Service following the posting of changes to these
              Terms will mean you accept those changes.
            </Text>
          </div>
        </div>

        {/* 2 Your Use of the Service */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'2. Your Use of the Service'}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              You are granted a limited, non-exclusive, revocable right to access and use the
              Service solely for your personal or internal business use. This right does not include
              the right to, and you shall not (nor shall you facilitate, direct, or assist a third
              party or end user to):
            </Text>
            <ul className='termsConditions__sectionWrapper__ul'>
              <li>
                <Text
                  size={type === 'modal' ? 'fs-14' : 'fs-16'}
                  color='neutral-500'
                >
                  Modify, reproduce, or resell any part of the Service’s content or data (excluding
                  your personal information), or otherwise commercially exploit any of the Service’s
                  content or data (even if that content or data is provided by a third party);
                </Text>
              </li>
              <li>
                <Text
                  size={type === 'modal' ? 'fs-14' : 'fs-16'}
                  color='neutral-500'
                >
                  Access, tamper with, or use non-public areas of the Service or our computer
                  systems;
                </Text>
              </li>
              <li>
                <Text
                  size={type === 'modal' ? 'fs-14' : 'fs-16'}
                  color='neutral-500'
                >
                  Probe, scan, or test the vulnerability of any system or network or breach or
                  circumvent any security or authentication measure;
                </Text>
              </li>
              <li>
                <Text
                  size={type === 'modal' ? 'fs-14' : 'fs-16'}
                  color='neutral-500'
                >
                  Use the service to scan or scrape any third-party website or software that you do
                  not have the right to do so;
                </Text>
              </li>

              <li>
                <Text
                  size={type === 'modal' ? 'fs-14' : 'fs-16'}
                  color='neutral-500'
                >
                  Access or search or attempt to access or search the Service by any means
                  (automated or otherwise) other than through our currently available, published
                  interfaces that are provided by us;
                </Text>
              </li>

              <li>
                <Text
                  size={type === 'modal' ? 'fs-14' : 'fs-16'}
                  color='neutral-500'
                >
                  Use any robot, spider, data miner, script, or other automated, semi-automated, or
                  similar means (whether technological or human) to extract or gather data from the
                  Service, or otherwise collect, gather, extract, scrape, or obtain any data or
                  content from the Service for any commercial purpose other than obtaining services
                  from us or your own personal or internal business use;
                </Text>
              </li>

              <li>
                <Text
                  size={type === 'modal' ? 'fs-14' : 'fs-16'}
                  color='neutral-500'
                >
                  Interfere with or disrupt, or attempt to do so, the access of any user, host, or
                  network, including (without limitation) sending a virus, flooding, spamming,
                  overloading, or mail-bombing the Service;
                </Text>
              </li>

              <li>
                <Text
                  size={type === 'modal' ? 'fs-14' : 'fs-16'}
                  color='neutral-500'
                >
                  Forge headers or otherwise manipulate identifiers in order to disguise the origin
                  of any content transmitted on, through or in connection with the or Service;
                </Text>
              </li>

              <li>
                <Text
                  size={type === 'modal' ? 'fs-14' : 'fs-16'}
                  color='neutral-500'
                >
                  Attempt to hide, hide, or direct, facilitate or assist any third party in hiding
                  your IP address to circumvent any of the restrictions in these Terms, including
                  without limitation, if any IP address you have been assigned or used is blocked or
                  dropped by us, you are hiding or switching your IP address to scrape or collect
                  data and content from this Service, or you have received a cease and desist or
                  other correspondence from us related to any activity in violation of these Terms
                  that requires you to cease accessing or using the Service;
                </Text>
              </li>

              <li>
                <Text
                  size={type === 'modal' ? 'fs-14' : 'fs-16'}
                  color='neutral-500'
                >
                  Use the Service or any of its content in any manner other than the manner in which
                  it is intended to be used, or in any way that interferes with its normal
                  operations or with any other user’s use and enjoyment of this Service, unless you
                  first obtain our express written consent;
                </Text>
              </li>

              <li>
                <Text
                  size={type === 'modal' ? 'fs-14' : 'fs-16'}
                  color='neutral-500'
                >
                  Upload, post, email or otherwise transmit any User Content that is unlawful,
                  harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libelous,
                  invasive of another’s privacy, hateful, or racially, ethnically, or otherwise
                  objectionable;
                </Text>
              </li>

              <li>
                <Text
                  size={type === 'modal' ? 'fs-14' : 'fs-16'}
                  color='neutral-500'
                >
                  Impersonate any person or entity, or falsely state or otherwise misrepresent your
                  affiliation with a person or entity;
                </Text>
              </li>

              <li>
                <Text
                  size={type === 'modal' ? 'fs-14' : 'fs-16'}
                  color='neutral-500'
                >
                  Upload, post, email or otherwise transmit any User Content that infringes any
                  privacy, patent, trademark, trade secret, copyright, or other proprietary rights
                  (“Rights”) of any party;
                </Text>
              </li>

              <li>
                <Text
                  size={type === 'modal' ? 'fs-14' : 'fs-16'}
                  color='neutral-500'
                >
                  Upload, post, email or otherwise transmit any unsolicited or unauthorized
                  advertising, promotional materials, “junk mail,” “spam,” “chain letters,” “pyramid
                  schemes,” or any other form of solicitation, except in those areas that are
                  designated for such purpose;
                </Text>
              </li>

              <li>
                <Text
                  size={type === 'modal' ? 'fs-14' : 'fs-16'}
                  color='neutral-500'
                >
                  Use the Service or its content for any purpose prohibited or restricted by or
                  otherwise violates applicable law; or
                </Text>
              </li>

              <li>
                <Text
                  size={type === 'modal' ? 'fs-14' : 'fs-16'}
                  color='neutral-500'
                >
                  Publish any reports or information generated through the Service.
                </Text>
              </li>
            </ul>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              Except for the limited right expressly granted to you in these Terms, we and our
              licensors expressly reserve all other rights and licenses.
            </Text>
          </div>
        </div>

        {/* 3 Your User Account */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'3. Your User Account'}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />

          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              If you register for an online account with us on the Service, you are solely
              responsible for maintaining the confidentiality and security of the password and
              account and are fully responsible for all activities that occur under your password or
              account. You agree to immediately notify us of any unauthorized use of your password
              or account or any other breach of security. For our business customers, you agree that
              you are solely responsible for your and your end user’s compliance with these Terms
              and for any of your and their acts or omissions in the use of the Service. You
              acknowledge and agree that only the end users approved by us in writing, and for which
              you have paid for, are permitted to utilize the Service.
            </Text>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              If you provide information on the Service, you agree to (a) provide true, accurate,
              current, and complete information about yourself, and (b) maintain and promptly update
              such information to keep it true, accurate, current, and complete to the extent the
              Service facilitates such updates. If you provide any information that is false,
              inaccurate, outdated, or incomplete, or we have reasonable grounds to suspect that
              such information is false, inaccurate, outdated, or incomplete, we have the right to
              suspend or terminate your account and prohibit or refuse any and all current or future
              use of the Service (or any portion thereof) by you or your end users.
            </Text>
          </div>
        </div>

        {/* 4 User Content */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'4. User Content'}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              As our Service evolves from time to time, you may be able to submit certain types of
              user-generated content (“User Content”) in the Service or exporting such User Content
              through the Service. By submitting User Content, you grant us an irrevocable,
              perpetual, non-exclusive, transferable, sub-licensable, fully paid, worldwide license
              (with the right to sublicense) to use, copy, publicly perform, publicly display,
              reformat, edit, translate, and create derivative works as desired by us to provide the
              Service in connection with its operations or for any other purpose permitted by law.
            </Text>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              By posting User Content, you represent and warrant that (a) you have the right to post
              the User Content, (b) that no third-party rights, laws, or regulations will be
              violated by such posting, (c) that you have the right to grant us the rights granted
              herein, (d) the User Content is not harmful, fraudulent, threatening, abusive,
              harassing, defamatory, vulgar, obscene, libelous, or otherwise objectionable or
              offensive, and (e) the User Content does not make the security of the Service
              vulnerable in any way. You are solely responsible for your User Content and the User
              Content of your end users, to the extent applicable. You acknowledge that we and our
              designees shall have the right (but not the obligation) in our sole discretion to
              refuse or remove or otherwise edit any User Content that is submitted through the
              Service.
            </Text>
          </div>
        </div>

        {/* 5 Use Outside of the United States */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'5. Use Outside of the United States'}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              We make no representation that the materials contained on the Service are appropriate
              or available for use in jurisdictions outside the United States, or that these Terms
              comply with the laws of any other country. Visitors who use the Service and reside
              outside the United States do so on their own initiative and are responsible for
              compliance with all laws, if and to the extent local laws are applicable. You agree
              that you will not access the Service from any territory where its contents are
              illegal, and that you, are solely responsible for compliance with all applicable local
              laws.
            </Text>
          </div>
        </div>

        {/* 6  Termination / Suspension */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'6. Termination / Suspension'}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              You agree that we may issue a warning, temporarily suspend, indefinitely suspend, or
              terminate your or your end user’s right to use or access all or any part of the
              Service, including any online account hereon, without notice, for any reason in our
              sole discretion, including, without limitation, violation of these Terms or our belief
              that your use or access would violate any applicable law or would be harmful to the
              interests of, or potentially cause financial loss or legal liability to, us, another
              user, or any third party.
            </Text>
          </div>
        </div>

        {/* 7  Trademarks */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'7. Trademarks'}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              We or third parties from whom we have permission, own the trademarks and service marks
              that are used on the Service. All rights are reserved by us and said third parties,
              and no implied rights are granted to you or any third parties. These and other
              graphics, logos, service marks, trademarks, and trade dress of ours and our licensors
              may not be used without prior written consent of us or our licensor. Without limiting
              the foregoing, no trademark or trade dress of ours may be used in connection with any
              product or service that is not ours, in any manner that is likely to cause confusion
              among users, or in any manner that disparages or discredits us.
            </Text>
          </div>
        </div>

        {/* 8 Copyright and Other Proprietary Rights */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'8. Copyright and Other Proprietary Rights'}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              We or third parties from whom we have permission, own the Service and all content that
              is used on the Service. All proprietary content and materials on the Service
              including, without limitation, the Service’s layout, organization, design, and any
              graphics, text, icons, audio, video, and the like are protected by copyrights,
              trademarks, service marks, trade secrets, and other proprietary rights and laws. You
              may not copy or use this proprietary content, except as allowed by these Terms or by
              written consent of the owner of the proprietary rights.
            </Text>
          </div>
        </div>

        {/* 9  Children’s Privacy */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'9. Children’s Privacy'}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              Individuals under the age of 18 (“
              <span className='termsConditions__text-bold'>Minors”</span>) are not permitted to use
              the Service. Furthermore, we do not knowingly collect or solicit personal information
              from Minors or knowingly allow such persons to register for an online account or to
              post personal information on our Service.
            </Text>
          </div>
        </div>

        {/* 10 Third-Party Sites */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'10. Third-Party Sites'}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              The Service may contain links to other unrelated websites on the Internet. We are not
              responsible for and we have no obligation to review the content, accuracy, copyright
              compliance, decency standards, or other materials on such websites. These Terms do not
              apply to such unrelated websites, and you should review the privacy policy and terms
              of use for any website that you visit. We make no representations or warranties
              regarding the security of any information you make available to such websites. We are
              not liable for any losses or damages incurred as the result of your business dealings
              with such third parties.
            </Text>
          </div>
        </div>

        {/* 11 Third-Party Data Sources */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'11. Third-Party Data Sources'}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              The Service may rely upon data and content obtained from third-party data sources. We
              are not responsible for and have no obligation as to the quality, accuracy, validity,
              or usefulness of the data that is obtained from third party data sources. We make no
              representations or warranties regarding the third-party data sources, or the data and
              content received from those sources, and we are not liable for any losses or damages
              incurred as the result of your use of such data. You are encouraged to independently
              validate and confirm all data that you receive through the Service or from us.
            </Text>
          </div>
        </div>

        {/* 12 Disclaimer of Warranties */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'12. Disclaimer of Warranties'}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              OUR SERVICE AND OUR CONTENT IS PROVIDED ON AN “AS IS,” “AS AVAILABLE” BASIS, WITHOUT
              REPRESENTATIONS OR WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT
              NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, SATISFACTORY QUALITY, OR NONINFRINGEMENT. WE DO NOT WARRANT THAT ANY PART OF
              THE SERVICE WILL OPERATE UNINTERRUPTED OR ERROR FREE, THAT DEFECTS WILL BE CORRECTED,
              OR THAT THE SERVICE OR THE SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER
              HARMFUL COMPONENTS. WE DO NOT WARRANT OR MAKE ANY REPRESENTATIONS REGARDING THE USE OR
              THE RESULTS OF THE USE OF THE SERVICE OR THE SERVICE IN TERMS OF ITS QUALITY,
              CORRECTNESS, ACCURACY, RELIABILITY, COMPLIANCE WITH LAW (INCLUDING, BUT NOT LIMITED
              TO, THE HEALTH INSURANCE PORTABILITY AND ACCOUNTABILITY ACT) OR OTHERWISE. ANY
              RELIANCE ON SERVICE CONTENT IS AT YOUR OWN RISK AND YOU ARE SOLELY RESPONSIBLE FOR
              DETERMINING WHETHER THE SERVICE IS SUITABLE FOR YOR BUSINESS AND IF AND CONTENT OR
              RESULTS GENERATED THROUGH THE SERVICE COMPLY WITH ANY LAWS APPICABLE TO YOU. WE CANNOT
              BE HELD RESPONSIBLE FOR ANY CLAIM THAT THE SERVICE OR RESULTS GENERATED THROUGH THE
              SERVICE ARE INACCURATE OR FAIL TO COMPLY WITH ANY LAW.
            </Text>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              YOU UNDERSTAND AND AGREE THAT WE ARE NOT PROVIDING LEGAL ADVICE NOR DOES OUR SERVICE
              REPLACE LEGAL ADVICE AND YOU ACKNOWLEDGE THAT YOU SHOULD WORK WITH YOUR ATTORNEY TO
              CONFIRM AND LEGAL COMPLIANCE OBLIGATIONS OR RESULTS.
            </Text>

            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              EXCEPT AS OTHERWISE EXPRESSLY PROVIDED, WE EXPRESSLY DISCLAIM ANY RESPONSIBILITY FOR
              THE ACCURACY, CONTENT, LEGALITY, AVAILABILITY OF INFORMATION, PRODUCTS, SERVICES, OR
              MERCHANDISE FOUND ON THIRD PARTY SITES THAT LINK TO OR FROM THE SERVICES. WE CANNOT BE
              HELD RESPONSIBLE FOR THE MATERIAL CONTAINED ON THIRD PARTY SITES AND/OR RELATED
              SERVICES NOR DO WE MAKE ANY REPRESENTATIONS OR WARRANTIES AS TO THE SECURITY OF ANY
              INFORMATION YOU MIGHT BE REQUESTED TO GIVE TO THIRD PARTY WEBSITES.
            </Text>
          </div>
        </div>

        {/* 13 Limitation of Liability */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'13. Limitation of Liability'}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              TO THE FURTHEST EXTENT PERMITTED BY LAW, UNDER NO CIRCUMSTANCES SHALL WE, OUR
              AFFILIATES, RELATED ENTITIES, VENDORS OR CONTENT PROVIDERS (COLLECTIVELY, THE
              “HIPAACHECKER PARTIES”) BE RESPONSIBLE OR LIABLE FOR ANY SPECIAL, INDIRECT, PUNITIVE,
              CONSEQUENTIAL, EXEMPLARY AND/OR INCIDENTAL DAMAGES WHATSOEVER INCLUDING, WITHOUT
              LIMITATION, DAMAGES FOR THE LOSS OF USE OR REPLACEMENT OF DATA, OR LOST PROFITS,
              ARISING OUT OF OR IN ANY WAY CONNECTED WITH THE USE OF THE SERVICE OR ANY OF ITS
              CONTENT WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR OTHERWISE,
              EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF DAMAGES. NOTWITHSTANDING ANYTHING
              ELSE CONTAINED IN THESE TERMS, TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE AGGREGATE
              LIABILITY OF THE HIPAACHECKER PARTIES SHALL NOT EXCEED THE GREATER OF THE TOTAL FEES
              PAID BY YOU TO US DURING THE TWELVE (12) MONTH PERIOD PRECEDING THE DATE UPON WHICH
              YOUR CLAIM AROSE, IF ANY, OR ONE HUNDRED DOLLARS (US $100).
            </Text>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              YOU AGREE TO PROMPTLY NOTIFY US IN WRITING IF YOU BELIEVE YOU HAVE ANY CLAIM AGAINST
              THE HIPAACHECKER PARTIES, AND, IN ANY EVENT, YOU AGREE THAT ANY CLAIM NOT BROUGHT
              WITHIN ONE YEAR AFTER IT ARISES (OR SUCH SHORTER PERIOD UNDER SERVICELICABLE STATUTES
              OF LIMITATION) SHALL BE WAIVED AND RELEASED.
            </Text>

            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              SOME STATES/JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR
              CERTAIN TYPES OF DAMAGES OR WARRANTIES. ACCORDINGLY, SOME OF THE EXCLUSIONS AND
              LIMITATIONS ABOVE MAY NOT SERVICELY.
            </Text>
          </div>
        </div>

        {/* 14 Indemnification */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'14. Indemnification'}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              You agree to indemnify, defend, and hold harmless us, our officers, representatives,
              directors, employees, consultants, third party suppliers, and agents from any and all
              losses, expenses, third-party claims, liabilities, fees, fines, damages, and costs
              (including, without limitation, attorneys’ fees) arising from or related to your or
              your end user’s use of the Service, your or your end user’s use of any material,
              information, data downloaded or otherwise obtained from the Service, your or your end
              user’s violation of applicable law, or your or your end user’s violation of these
              Terms, including without limitation, your or your end user’s infringement of any
              intellectual property or other right of ours or any other person or entity.
            </Text>
          </div>
        </div>

        {/* 15 Notice */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'15. Notice'}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              We may deliver notice to you by means of e-mail, a general notice on the Service, or
              by other reliable method to the address you have provided to us.
            </Text>
          </div>
        </div>

        {/* 16 Interpretation and Disputes */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'16. Interpretation and Disputes'}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              These Terms are governed by the laws of the State of Wisconsin, without regard to any
              conflict of law’s provisions. Any disputes under these Terms, shall be resolved
              through binding arbitration.
            </Text>

            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              YOU AND US ARE AGREEING TO GIVE UP ANY RIGHTS TO LITIGATE CLAIMS IN A COURT OR BEFORE
              A JURY, OR TO PARTICIPATE IN A CLASS ACTION OR REPRESENTATIVE ACTION WITH RESPECT TO A
              CLAIM. OTHER RIGHTS THAT YOU WOULD HAVE IF YOU WENT TO COURT MAY ALSO BE UNAVAILABLE
              OR MAY BE LIMITED IN ARBITRATION.
            </Text>

            <ol className='termsConditions__sectionWrapper__ol'>
              <li>
                <Text
                  size={type === 'modal' ? 'fs-14' : 'fs-16'}
                  color='neutral-500'
                >
                  ANY CLAIM, DISPUTE OR CONTROVERSY (WHETHER IN CONTRACT, TORT OR OTHERWISE, WHETHER
                  PRE-EXISTING, PRESENT OR FUTURE, AND INCLUDING STATUTORY, CONSUMER PROTECTION,
                  COMMON LAW, INTENTIONAL TORT, INJUNCTIVE AND EQUITABLE CLAIMS) BETWEEN YOU AND US
                  ARISING FROM OR RELATING IN ANY WAY TO YOUR USE OF THE SERVICE WILL BE RESOLVED
                  EXCLUSIVELY AND FINALLY BY BINDING ARBITRATION.
                </Text>
              </li>
              <li>
                <Text
                  size={type === 'modal' ? 'fs-14' : 'fs-16'}
                  color='neutral-500'
                >
                  The arbitration will be administered by the American Arbitration Association
                  (“AAA”) in accordance with either the Consumer Arbitration Rules or the Commercial
                  Arbitration Rules as applicable (the “AAA Rules”) then in effect, except as
                  modified by this Section 16. (The AAA Rules are available at adr.org or by calling
                  the AAA at 1 800 778 7879.) The Federal Arbitration Act (“FAA”) will govern the
                  interpretation and enforcement of this Section 16; but if the FAA is inapplicable
                  for any reason, the governing law identified in Section 16 shall apply, without
                  regard to choice of law principles. Unless both parties agree otherwise, any
                  arbitration hearings between you and us will take place in Milwaukee County,
                  Wisconsin.
                </Text>
              </li>
              <li>
                <Text
                  size={type === 'modal' ? 'fs-14' : 'fs-16'}
                  color='neutral-500'
                >
                  Except as provided herein, the arbitrator will have exclusive authority to resolve
                  any dispute relating to arbitrability and/or enforceability of this arbitration
                  provision, including any unconscionability challenge or any other challenge that
                  the arbitration provision or the Terms are void, voidable or otherwise invalid.
                  The arbitrator will be empowered to grant whatever relief would be available in
                  court under law or in equity. Any award of the arbitrator(s) will be final and
                  binding on each of the parties and may be entered as a judgment in any court of
                  competent jurisdiction. You and we agree that neither party shall appeal any award
                  of the arbitrator, including any appeal on a question of law, question of fact or
                  question of mixed fact and law.
                </Text>
              </li>

              <li>
                <Text
                  size={type === 'modal' ? 'fs-14' : 'fs-16'}
                  color='neutral-500'
                >
                  We will be responsible for paying any individual consumer’s arbitration/arbitrator
                  fees. If an individual consumer prevails on any claim that affords the prevailing
                  party attorneys’ fees, the arbitrator may award reasonable fees to you under the
                  standards for fee shifting provided by law. For the avoidance of doubt, this
                  Section 16(D) shall only apply to individual consumers.
                </Text>
              </li>
              <li>
                <Text
                  size={type === 'modal' ? 'fs-14' : 'fs-16'}
                  color='neutral-500'
                >
                  You agree to an arbitration on an individual basis. In any dispute, NEITHER PARTY
                  WILL BE ENTITLED TO JOIN OR CONSOLIDATE CLAIMS BY OR AGAINST OTHER CUSTOMERS IN
                  COURT OR IN ARBITRATION OR OTHERWISE PARTICIPATE IN ANY CLAIM AS A CLASS
                  REPRESENTATIVE, CLASS MEMBER OR IN A PRIVATE ATTORNEY GENERAL CAPACITY. The
                  arbitral tribunal shall not consolidate more than one person’s claims and shall
                  not otherwise preside over any form of a representative or class proceeding. The
                  arbitral tribunal has no power to consider the enforceability of this class
                  arbitration waiver and any challenge to the class arbitration waiver may only be
                  raised in a court of competent jurisdiction located in the jurisdiction set forth
                  in Milwaukee County, Wisconsin.
                </Text>
              </li>
              <li>
                <Text
                  size={type === 'modal' ? 'fs-14' : 'fs-16'}
                  color='neutral-500'
                >
                  If any provision of this Section is found unenforceable, the unenforceable
                  provision will be severed and the remaining arbitration terms will be enforced;
                  provided, that in the event Section 16(E) is found to be unenforceable, all of
                  this Section 16 shall be deemed null and void and of no effect.
                </Text>
              </li>
            </ol>

            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              If any provision of these Terms is deemed unenforceable or invalid by a court or
              arbitrator, then the court or arbitrator shall modify such provision to the minimum
              extent necessary to make such provision enforceable and valid. Should such
              modification prove impossible or impracticable, then the provision shall be severed,
              and the remaining terms of these Terms shall be interpreted and read to give them
              maximum enforceability.
            </Text>

            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              Notwithstanding the foregoing provisions, we retain the right to seek injunctive or
              other equitable relief in a court of competent jurisdiction to prevent the actual or
              threatened infringement, misappropriation or violation of a party’s copyrights,
              trademarks, trade secrets, patents, or other intellectual property.
            </Text>
          </div>
        </div>

        {/* 17 Entire Agreement */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'17. Entire Agreement'}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              These Terms and any related ordering documents constitute the entire agreement between
              you and us relating to the subject matter herein, and supersede all prior or
              contemporaneous understandings or agreements, written or oral, regarding such subject
              matter.
            </Text>
          </div>
        </div>

        {/* 18 Waiver and Severability */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'18. Waiver and Severability '}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              Furthermore, no delay or omission by us to exercise any right shall impair any such
              right or be construed to be a waiver by us. If any provision of the Terms is found by
              a court of competent jurisdiction to be invalid or unenforceable in whole or in part,
              such provision shall, as to such jurisdiction, be ineffective to the extent of such
              invalidity or unenforceability without in any manner affecting the validity or
              enforceability thereof in any other jurisdiction or the remaining provisions hereof in
              any jurisdiction, provided, however, if such invalid or unenforceable provision may be
              modified so as to be valid and enforceable as a matter of law, such provision will be
              deemed to have been modified so as to be valid and enforceable to the maximum extent
              permitted by law.
            </Text>
          </div>
        </div>

        {/* 19 Electronic Communications */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'19.Electronic Communications'}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              You acknowledge that these Terms are a valid and binding agreement. To the fullest
              extent permitted by law, you agree that these Terms and any other documentation,
              agreements, notices, or communications between you and us may be provided to you
              electronically. Please print a copy of all such documentation, agreements, notices, or
              other communications for your reference.
            </Text>
          </div>
        </div>

        {/* 20  Mobile Devices */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'20. Mobile Devices'}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              Some mobile devices may not be capable of accessing the Service in its entirety. We
              are not responsible or liable for any errors, inaccuracies, faults, or failures
              arising from your attempts to access any portion of the Service using any mobile
              device. Furthermore, you agree that you alone are responsible for all access and
              connectivity charges imposed by your communications carrier in connection with your
              use of any mobile device.
            </Text>
          </div>
        </div>

        {/* 21 Force Majeure */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'21. Force Majeure'}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              We shall not be liable to you or any other party for any delay or failure in
              performance due to events outside of our reasonable control, including without
              limitation, acts of God or a public enemy, act of any military, civil or regulatory
              authority, change in any law or regulation, pandemic, fire, flood, earthquake, storm
              or other like event, disruption or outage of third-party communications facilities or
              networks, labor strike, delays of common carriers, or any other circumstances beyond
              our reasonable control.
            </Text>
          </div>
        </div>

        {/* 22 Patches and Updates */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'22. Patches and Updates'}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              We may apply patches, updates, and modifications to the Service and associated
              software at any time, and features may change after the application of an update. We
              may change, modify, suspend, or discontinue any aspect of any feature or service on
              the Service at any time. We may also impose limits on certain features or restrict
              your access to parts or all of the Service and associated software without notice or
              liability. We make no representation that a feature, the Service and/or associated
              software will work on a particular web browser, version of a web browser or device.
            </Text>
          </div>
        </div>

        {/* 23 Contact */}
        <div className='termsConditions__sectionWrapper'>
          <Heading
            title={'23. Contact'}
            type={type === 'modal' ? 'h7' : 'h4'}
            color='neutral-800'
          />
          <div className='termsConditions__sectionWrapper__content'>
            <Text
              size={type === 'modal' ? 'fs-14' : 'fs-16'}
              color='neutral-500'
            >
              To ask questions or comment about these Terms, we may be contacted at: <br />
              <Link href='mailto:ubitrix.intl@gmail.com'>ubitrix.intl@gmail.com</Link>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
