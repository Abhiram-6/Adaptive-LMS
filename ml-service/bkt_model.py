class BKTModel:
    def __init__(self, p_l0=0.3, p_t=0.09, p_g=0.2, p_s=0.1):
        self.p_l0 = p_l0   # prior knowledge
        self.p_t  = p_t    # probability of learning
        self.p_g  = p_g    # probability of guess
        self.p_s  = p_s    # probability of slip

    def update(self, p_l, correct: bool) -> float:
        # Step 1: probability of observed response
        if correct:
            p_obs = (p_l * (1 - self.p_s)) + ((1 - p_l) * self.p_g)
        else:
            p_obs = (p_l * self.p_s) + ((1 - p_l) * (1 - self.p_g))

        # Step 2: posterior — P(L | response)
        if correct:
            p_l_given_obs = (p_l * (1 - self.p_s)) / p_obs
        else:
            p_l_given_obs = (p_l * self.p_s) / p_obs

        # Step 3: add learning opportunity
        p_l_new = p_l_given_obs + ((1 - p_l_given_obs) * self.p_t)

        return round(p_l_new, 4)

    def run_sequence(self, responses: list) -> list:
        p_l = self.p_l0
        history = [round(p_l, 4)]
        for correct in responses:
            p_l = self.update(p_l, correct)
            history.append(p_l)
        return history

    def is_mastered(self, p_l, threshold=0.75) -> bool:
        return p_l >= threshold