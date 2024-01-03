from typing import cast
from flask.views import MethodView
from flask import request

from core.shared.models import PasswordsSchema, Passwords, Casing
from core.users import reset_passwords, get
from core.shared.config import CONFIG

from ..shared.utils import success_response, error_reponse, get_session_token


class ResetPasswords(MethodView):
    def post(self):
        try:
            if not request.is_json:
                raise Exception("Request is not JSON")
            token = get_session_token()
            user = get(token)
            json_data = request.data.decode("utf-8")
            schema = PasswordsSchema(external_casing=Casing.CAMEL)
            passwords: Passwords = cast(Passwords, schema.loads(json_data))
            reset_passwords(user, token, passwords)

            return success_response(data={"message": "Password reseted successfully"},
                                    convert_keys_to_camel=True)

        except Exception as e:
            return error_reponse(e)
    