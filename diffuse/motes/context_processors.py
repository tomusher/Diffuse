from motes.models import Plan

def user_plans(request):
    if(request.user.is_authenticated()):
        plans = Plan.objects.filter(user=request.user)
    else:
        plans = []
    return {'plans':plans}
