# An example of a pytest test case


def test_range_inclusivity():
    """
    Test that "range" is not inclusive of its right endpoint
    """
    a = [x for x in range(0, 10)]
    assert 9 in a
    assert 10 not in a
