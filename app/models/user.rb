class User < ApplicationRecord
  has_secure_password

  PASSWORD_REGEX = /\A(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,70}\Z/.freeze
  PASSWORD_COMPLEXITY = 'must be over 6 characters and include: ' \
                        '1 uppercase, 1 lowercase, 1 digit and 1 special character'

  validates :email, uniqueness: true, presence: true
  validates :password,
            format: { with: PASSWORD_REGEX, message: PASSWORD_COMPLEXITY },
            if: :will_save_change_to_password_digest?
  validates :password_confirmation, presence: true, if: :will_save_change_to_password_digest?
end
